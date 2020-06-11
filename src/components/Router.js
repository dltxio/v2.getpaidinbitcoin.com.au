import React from "react";
import { Router as ReactRouter, Route, Switch } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AuthRoute from "../components/AuthRoute";
import Dashboard from "../pages/Dashboard";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

const Router = () => (
  <ReactRouter history={history}>
    <Switch>
      <Route path="/login" component={LoginPage} />
      <AuthRoute path="/" component={Dashboard} />
    </Switch>
  </ReactRouter>
);

export default Router;
