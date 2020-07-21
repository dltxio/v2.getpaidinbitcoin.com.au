import React, { createContext, useEffect, useState } from "react";
import useSWR, { cache } from "swr";
import gpib from "../apis/gpib";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isVerified, setVerified] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const { data: userStatus, error: fetchStatusError } = useSWR(
    user && "/user/status"
  );

  useEffect(() => {
    cache.clear();
    const initialUser = JSON.parse(window.localStorage.getItem("user"));
    setUser(initialUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    userStatus === 5 ? setVerified(true) : setVerified(false);
  }, [userStatus]);

  useEffect(() => {
    const isLoading = !user || (!userStatus && !fetchStatusError);
    setLoading(isLoading);
  }, [user, userStatus, fetchStatusError]);

  const login = async (credentials) => {
    try {
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
        user,
        isLoading,
        isLoggingIn,
        isVerified,
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
