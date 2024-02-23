import React, { createContext, useEffect, useState } from "react";
import useSWR, { cache } from "swr";
import gpib from "apis/gpib";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isVerified, setVerified] = useState(false);
  const [skipKYC, setSkipKYC] = useState(false);

  const { data: userDetails, error: fetchDetailsError } = useSWR(
    user && `/user/${user.id}`
  );
  const isFetchingDetails = user && !userDetails && !fetchDetailsError;

  const { data: depositHints } = useSWR(
    user && `/user/${user.id}/deposithints`
  );
  const { data: userEnterprise } = useSWR(
    user && `/user/${user.id}/enterprise`
  );
  const { data: userAddress } = useSWR(user && `/user/${user.id}/address`);
  const { emailVerified, idVerificationStatus } = userDetails || {};
  const { depositAmount } = depositHints || {};
  const { name: employerName } = userEnterprise || {};

  useEffect(() => {
    const isVerified = emailVerified && idVerificationStatus === 3;
    setVerified(isVerified);
  }, [
    userAddress,
    emailVerified,
    depositAmount,
    employerName,
    idVerificationStatus,
    setVerified
  ]);

  useEffect(() => {
    cache.clear();
    const initialUser = JSON.parse(window.localStorage.getItem("user"));
    setUser(initialUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      cache.clear();
      setLoggingIn(true);
      const { data: user } = await gpib.open.post(
        "/user/authenticate",
        credentials
      );
      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setLoggingIn(false);
    } catch (e) {
      setLoggingIn(false);
      setLoginError(e);
      throw e;
    }
  };

  const logout = () => {
    window.localStorage.removeItem("user");
    cache.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user && {
          ...userDetails,
          ...user
        },
        isLoggingIn: isLoggingIn || isFetchingDetails,
        isLoading,
        login,
        logout,
        loginError,
        isVerified,
        setVerified,
        skipKYC,
        setSkipKYC
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
