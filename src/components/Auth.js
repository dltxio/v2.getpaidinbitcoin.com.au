import React, { createContext, useEffect, useState } from "react";
import { cache } from "swr";
import gpib from "../apis/gpib";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isLoggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const initialUser = JSON.parse(window.localStorage.getItem("user"));
    setUser(initialUser);
    setLoading(false);
  }, []);

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
      value={{ user, isLoading, isLoggingIn, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
