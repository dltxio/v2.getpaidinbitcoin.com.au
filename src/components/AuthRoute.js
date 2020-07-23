import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import Loader from "./Loader";

const AuthRoute = ({ component, allowUnverified, ...props }) => {
  const { user, isLoggingIn, isVerified, isVerifying } = useContext(
    AuthContext
  );
  const Component = component;
  const isLoading = isLoggingIn && (!allowUnverified || isVerifying);
  const isPass = user && (allowUnverified || isVerified);
  let redirectPath = "/login";
  if (user && !isPass) redirectPath = "/";
  return (
    <Route
      {...props}
      render={() => {
        if (isLoading) return <Loader loading />;
        return isPass ? <Component /> : <Redirect to={redirectPath} />;
      }}
    />
  );
};

export default AuthRoute;
