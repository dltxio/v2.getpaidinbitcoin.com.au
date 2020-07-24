import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AuthRoute from "../components/AuthRoute";
import Dashboard from "../pages/Dashboard";
import AddressModalForm from "./forms/AddressForm/AddressModalForm";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import ProfilePage from "../pages/ProfilePage";
import DepositHintsModalEdit from "../components/forms/DepositHintsForm/DepositHintsModalEdit";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/auth/resetpassword/:token" component={ResetPasswordPage} />
      <Route path="/auth/resetpassword" component={ResetPasswordPage} />
      <Route path="/verify/email/:token" component={VerifyEmailPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <AuthRoute path="/profile" component={ProfilePage} />
      <AuthRoute path="/" component={Dashboard} allowUnverified />
    </Switch>
    <Switch>
      <AuthRoute path="*/address/add" component={AddressModalForm} />
      <AuthRoute path="*/payroll/edit" component={DepositHintsModalEdit} />
    </Switch>
  </BrowserRouter>
);

export default Router;
