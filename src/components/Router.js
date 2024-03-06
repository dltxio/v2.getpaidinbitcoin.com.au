import React, { useContext } from "react";
import { AuthContext } from "components/auth/Auth";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
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
import LoadingPage from "pages/LoadingPage";

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
        <Route path="/verify/email/:token" element={<VerifyEmailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*/register" element={<RegisterPage />} />
        {/* Route/s below need Authentication check -- authRedirectHandler() */}
        <Route path="/contactsupport" element={authRedirectHandler(<ContactSupportPage />)} />
        <Route path="/addresses" element={authRedirectHandler(<AddressesPage />)} />
        <Route path="/profile" element={authRedirectHandler(<ProfilePage />)} />
        <Route path="/bills" element={authRedirectHandler(<BillsPage/>)} />
        <Route path="/" element={authRedirectHandler(<Dashboard />)} />
        <Route path="/addresses/add" element={authRedirectHandler(<AddressModalAdd />)} />
        <Route path="/addresses/edit/:id" element={authRedirectHandler(<AddressModalEdit />)} />
        <Route path="/addresses/swap/:id" element={authRedirectHandler(<AddressModalSwap />)} />
        <Route path="/addresses/group/:id" element={authRedirectHandler(<AddressGroupModal />)} />
        <Route path="/addresses/groupedit/:id" element={authRedirectHandler(<AddressGroupModal />)} />
        <Route path="/addresses/groupadd" element={authRedirectHandler(<AddressGroupModalAdd />)} />
        <Route path="/addresses/archive/:id" element={authRedirectHandler(<AddressModalArchive />)} />
        <Route path="/profile/payroll/edit" element={authRedirectHandler(<DepositHintsModalEdit />)} />
        <Route path="/profile/referral/send" element={authRedirectHandler(<ReferralSendModal />)} />
        <Route path="/profile/accountInfo/edit" element={authRedirectHandler(<AccountInfoModal />)} />
        <Route path="/profile/mobile/send" element={authRedirectHandler(<UpdateMobileModal />)} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
