import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import AuthRoute from "components/auth/AuthRoute";
import Dashboard from "pages/Dashboard";
import AccountInfoModal from "components/users/AccountInfoModalEdit";
import AddressesPage from "pages/AddressesPage";
import AddressGroupModal from "components/addresses/AddressGroupModal";
import AddressGroupModalAdd from "components/addresses/AddressGroupModalAdd";
import AddressModalAdd from "components/addresses/AddressModalAdd";
import AddressModalArchive from "components/addresses/AddressModalArchive";
import AddressModalEdit from "components/addresses/AddressModalEdit";
import AddressModalSwap from "components/addresses/AddressModalSwap";
import ContactSupportPage from "pages/ContactSupportPage";
import DepositHintsModalEdit from "components/deposit-hints/DepositHintsModalEdit";
import EnterpriseOnboard from "pages/EnterpriseOnboard";
import ProfilePage from "pages/ProfilePage";
import ReferralSendModal from "components/users/ReferralSendModal";
import RefreshLoginModal from "components/auth/RefreshLoginModal";
import ResetPasswordPage from "pages/ResetPasswordPage";
import UpdateMobileModal from "components/users/UpdateMobileModal";
import VerifyEmailPage from "pages/VerifyEmailPage";

const Router = () => (
  <BrowserRouter>
    <RefreshLoginModal />
    <Switch>
      <Route path="/enterprise" element={<EnterpriseOnboard/>} />
      <Route path="/auth/resetpassword/:token" element={<ResetPasswordPage/>} />
      <Route path="/auth/resetpassword" element={<ResetPasswordPage/>} />
      <Route path="/verify/email/:token" element={<VerifyEmailPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="*/register" element={<RegisterPage/>} />
      <AuthRoute path="/contactsupport" element={<ContactSupportPage/>} />
      <AuthRoute path="/addresses" element={<AddressesPage/>} />
      <AuthRoute path="/profile" element={<ProfilePage/>} />
      <AuthRoute path="/" element={<Dashboard/>} allowUnverified />
    </Switch>
    <Switch>
      <AuthRoute path="*/addresses/add" element={<AddressModalAdd/>} />
      <AuthRoute path="*/addresses/edit/:id" element={<AddressModalEdit/>} />
      <AuthRoute path="*/addresses/swap/:id" element={<AddressModalSwap/>} />
      <AuthRoute path="*/addresses/group/:id" element={<AddressGroupModal/>} />
      <AuthRoute
        path="*/addresses/groupEdit/:id"
        element={<AddressGroupModal/>}
      />
      <AuthRoute path="*/addresses/groupadd" element={<AddressGroupModalAdd/>} />
      <AuthRoute
        path="*/addresses/archive/:id"
        element={<AddressModalArchive/>}
      />
      <AuthRoute path="*/payroll/edit" element={<DepositHintsModalEdit/>} />
      <AuthRoute path="*/referral/send" element={<ReferralSendModal/>} />
      <AuthRoute path="*/accountInfo/edit" element={<AccountInfoModal/>} />
      <AuthRoute path="*/mobile/send" element={<UpdateMobileModal/>} />
    </Switch>
  </BrowserRouter>
);

export default Router;
