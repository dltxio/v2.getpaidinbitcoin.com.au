import React, { useContext } from "react";
import { AuthContext } from "components/auth/Auth";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AddressesPage from "pages/AddressesPage";
import BillsPage from "pages/BillsPage";
import ContactSupportPage from "pages/ContactSupportPage";
import Dashboard from "pages/Dashboard";
import EnterpriseOnboard from "pages/EnterpriseOnboard";
import LoadingPage from "pages/LoadingPage";
import LoginPage from "pages/LoginPage";
import ProfilePage from "pages/ProfilePage";
import RefreshLoginModal from "components/auth/RefreshLoginModal";
import RegisterPage from "pages/RegisterPage";
import ResetPasswordPage from "pages/ResetPasswordPage";
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
        <Route path="/contactsupport" element={authRedirectHandler(<ContactSupportPage />)} />
        <Route path="/addresses" element={authRedirectHandler(<AddressesPage />)} />
        <Route path="/profile" element={authRedirectHandler(<ProfilePage />)} />
        <Route path="/bills" element={authRedirectHandler(<BillsPage/>)} />
        <Route path="/" element={authRedirectHandler(<Dashboard />)} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
