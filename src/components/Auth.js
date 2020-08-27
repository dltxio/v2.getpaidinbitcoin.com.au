import React, { createContext, useEffect, useState } from "react";
import useSWR, { cache } from "swr";
import gpib from "apis/gpib";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const { data: userDetails, error: fetchDetailsError } = useSWR(
    user && `/user/${user.id}`
  );
  const isFetchingDetails = user && !userDetails && !fetchDetailsError;
  const { data: userStatus, error: fetchStatusError, isValidating } = useSWR(
    user && "/user/status"
  );
  const isVerified = userStatus === 5;
  const isVerifying = !userStatus && !fetchStatusError && isValidating;

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
    setUser(null);
    cache.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user && { ...userDetails, ...user },
        isLoggingIn: isLoggingIn || isFetchingDetails,
        isLoading,
        isVerified,
        isVerifying,
        login,
        logout,
        loginError,
        userStatus,
        fetchStatusError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
