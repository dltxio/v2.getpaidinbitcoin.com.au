import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import IdemRegisterPage from "pages/IdemRegisterPage";
import AuthRoute from "components/auth/AuthRoute";
import Dashboard from "pages/Dashboard";
import AddressModalAdd from "components/addresses/AddressModalAdd";
import AddressModalEdit from "components/addresses/AddressModalEdit";
import ResetPasswordPage from "pages/ResetPasswordPage";   
import VerifyEmailPage from "pages/VerifyEmailPage";
import AddressesPage from "pages/AddressesPage";
import ProfilePage from "pages/ProfilePage";
import DepositHintsModalEdit from "components/deposit-hints/DepositHintsModalEdit";
import AddressModalSwap from "components/addresses/AddressModalSwap";
import AddressModalArchive from "components/addresses/AddressModalArchive";
import ContactSupportPage from "pages/ContactSupportPage";
import RefreshLoginModal from "components/auth/RefreshLoginModal";
import ReferralSendModal from "components/users/ReferralSendModal";
import EnterpriseOnboard from "pages/EnterpriseOnboard";
import AccountInfoModal from "components/users/AccountInfoModalEdit";
import AddressGroupModal from "components/addresses/AddressGroupModal";
import AddressGroupModalAdd from "components/addresses/AddressGroupModalAdd";
import UpdateMobileModal from "components/users/UpdateMobileModal";

const Router = () => (
  <BrowserRouter>
    <RefreshLoginModal />
    <Switch>
      <Route path="/enterprise" component={EnterpriseOnboard} />
      <Route path="/auth/resetpassword/:token" component={ResetPasswordPage} />
      <Route path="/auth/resetpassword" component={ResetPasswordPage} />
      <Route path="/verify/email/:token" component={VerifyEmailPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="*/register/idem" component={IdemRegisterPage} />
      <Route path="*/register" component={RegisterPage} />
      <AuthRoute path="/contactsupport" component={ContactSupportPage} />
      <AuthRoute path="/addresses" component={AddressesPage} />
      <AuthRoute path="/profile" component={ProfilePage} />
      <AuthRoute path="/" component={Dashboard} allowUnverified />
    </Switch>
    <Switch>
      <AuthRoute path="*/addresses/add" component={AddressModalAdd} />
      <AuthRoute path="*/addresses/edit/:id" component={AddressModalEdit} />
      <AuthRoute path="*/addresses/swap/:id" component={AddressModalSwap} />
      <AuthRoute path="*/addresses/group/:id" component={AddressGroupModal} />
      <AuthRoute
        path="*/addresses/groupEdit/:id"
        component={AddressGroupModal}
      />
      <AuthRoute path="*/addresses/groupAdd" component={AddressGroupModalAdd} />
      <AuthRoute
        path="*/addresses/archive/:id"
        component={AddressModalArchive}
      />
      <AuthRoute path="*/payroll/edit" component={DepositHintsModalEdit} />
      <AuthRoute path="*/referral/send" component={ReferralSendModal} />
      <AuthRoute path="*/accountInfo/edit" component={AccountInfoModal} />
      <AuthRoute path="*/mobile/send" component={UpdateMobileModal} />
    </Switch>
  </BrowserRouter>
);

export default Router;
