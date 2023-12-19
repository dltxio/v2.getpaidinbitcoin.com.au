import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "components/auth/Auth";
import LoadingPage from "pages/LoadingPage";

const AuthRoute = ({ component, allowUnverified, ...props }) => {
  const { user, isLoggingIn, isLoading: isPageLoading } = useContext(
    AuthContext
  );
  const Component = component;
  const redirectPath = user ? "/" : "/login";

  return (
    <Route
      {...props}
      render={() =>
        isLoggingIn || isPageLoading ? (
          <LoadingPage />
        ) : user ? (
          <Component />
        ) : (
          <Navigate to={redirectPath} />
        )
      }
    />
  );
};

export default AuthRoute;
