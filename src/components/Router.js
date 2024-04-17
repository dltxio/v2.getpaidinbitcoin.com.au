import React, { useContext } from "react";
import { AuthContext } from "components/auth/Auth";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AccountInfoModal from "components/users/AccountInfoModalEdit";
import AddressesPage from "pages/AddressesPage";
import AddressGroupModal from "components/addresses/AddressGroupModal";
import AddressGroupModalAdd from "components/addresses/AddressGroupModalAdd";
import BillsPage from "pages/BillsPage";
import ContactSupportPage from "pages/ContactSupportPage";
import Dashboard from "pages/Dashboard";
import DepositHintsModalEdit from "components/deposit-hints/DepositHintsModalEdit";
import EnterpriseOnboard from "pages/EnterpriseOnboard";
import LoadingPage from "pages/LoadingPage";
import LoginPage from "pages/LoginPage";
import ProfilePage from "pages/ProfilePage";
import ReferralSendModal from "components/users/ReferralSendModal";
import RefreshLoginModal from "components/auth/RefreshLoginModal";
import RegisterPage from "pages/RegisterPage";
import ResetPasswordPage from "pages/ResetPasswordPage";
import UpdateMobileModal from "components/users/UpdateMobileModal";
import VerifyEmailPage from "pages/VerifyEmailPage";

const Router = () => {
  const { user, isLoggingIn, isLoading: isPageLoading } = useContext(AuthContext);
  const authRedirectHandler = (targeElement) => (isLoggingIn || isPageLoading ? <LoadingPage /> : user ? targeElement : <Navigate to={"/login"} />);

  return (
    <BrowserRouter>
      <RefreshLoginModal />
      <Routes>
        <Route path="/enterprise" element={<EnterpriseOnboard />} />
        <Route path="/auth/resetpassword/:token" element={<ResetPasswordPage />} />
        <Route path="/auth/resetpassword" element={<ResetPasswordPage />} />
        <Route path="/verify/email" element={<VerifyEmailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Route/s below need Authentication check -- authRedirectHandler() */}
        <Route path="/contactsupport" element={authRedirectHandler(<ContactSupportPage />)} />
        <Route path="/addresses" element={authRedirectHandler(<AddressesPage />)} />
        <Route path="/profile" element={authRedirectHandler(<ProfilePage />)} />
        <Route path="/bills" element={authRedirectHandler(<BillsPage/>)} />
        <Route path="/" element={authRedirectHandler(<Dashboard />)} />
        <Route path="/addresses/groupedit/:id" element={authRedirectHandler(<AddressGroupModal />)} />
        <Route path="/addresses/groupadd" element={authRedirectHandler(<AddressGroupModalAdd />)} />
        <Route path="/profile/payroll/edit" element={authRedirectHandler(<DepositHintsModalEdit />)} />
        <Route path="/profile/referral/send" element={authRedirectHandler(<ReferralSendModal />)} />
        <Route path="/profile/accountInfo/edit" element={authRedirectHandler(<AccountInfoModal />)} />
        <Route path="/profile/mobile/send" element={authRedirectHandler(<UpdateMobileModal />)} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
