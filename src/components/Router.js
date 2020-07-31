import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AuthRoute from "../components/AuthRoute";
import Dashboard from "../pages/Dashboard";
import AddressModalAdd from "./forms/AddressForm/AddressModalAdd";
import AddressModalEdit from "./forms/AddressForm/AddressModalEdit";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import AddressesPage from "../pages/AddressesPage";
import ProfilePage from "../pages/ProfilePage";
import DepositHintsModalEdit from "../components/forms/DepositHintsForm/DepositHintsModalEdit";
import AddressModalSwap from "./forms/AddressForm/AddressModalSwap";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/auth/resetpassword/:token" component={ResetPasswordPage} />
      <Route path="/auth/resetpassword" component={ResetPasswordPage} />
      <Route path="/verify/email/:token" component={VerifyEmailPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <AuthRoute path="/addresses" component={AddressesPage} />
      <AuthRoute path="/profile" component={ProfilePage} />
      <AuthRoute path="/" component={Dashboard} allowUnverified />
    </Switch>
    <Switch>
      <AuthRoute path="*/addresses/add" component={AddressModalAdd} />
      <AuthRoute path="*/addresses/edit/:id" component={AddressModalEdit} />
      <AuthRoute path="*/addresses/swap/:id" component={AddressModalSwap} />
      <AuthRoute path="*/payroll/edit" component={DepositHintsModalEdit} />
    </Switch>
  </BrowserRouter>
);

export default Router;
