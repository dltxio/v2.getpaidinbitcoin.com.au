import React from "react";
import { Router as ReactRouter, Route, Switch } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AuthRoute from "../components/AuthRoute";
import Dashboard from "../pages/Dashboard";
import { createBrowserHistory } from "history";
import AddressModalForm from "./forms/AddressForm/AddressModalForm";
import ResetPasswordPage from "../pages/ResetPasswordPage";

export const history = createBrowserHistory();

const Router = () => (
  <ReactRouter history={history}>
    <Switch>
      <Route path="/auth/resetpassword/:token" component={ResetPasswordPage} />
      <Route path="/auth/resetpassword" component={ResetPasswordPage} />
      <Route path="/auth" component={LoginPage} />
      <AuthRoute path="/" component={Dashboard} />
    </Switch>
    <Switch>
      <AuthRoute path="/address/add" component={AddressModalForm} />
    </Switch>
  </ReactRouter>
);

export default Router;
