import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const initialUser = JSON.parse(window.localStorage.getItem("user"));
    setUser(initialUser);
    setLoading(false);
  }, []);

  const login = (user) => {
    window.localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    window.localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
