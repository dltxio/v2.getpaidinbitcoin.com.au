import React from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import Layout from "components/layout/Layout";
import ResetPasswordLinkForm from "components/auth/ResetPasswordLinkForm";
import ResetPasswordForm from "components/auth/ResetPasswordForm";

const ResetPasswordPage = () => {
  const location = useLocation();
  const { token } = qs.parse(location.search, { ignoreQueryPrefix: true });
  const { userid } = qs.parse(location.search, { ignoreQueryPrefix: true });
  const { email } = qs.parse(location.search, { ignoreQueryPrefix: true });
  const { expiry } = qs.parse(location.search, { ignoreQueryPrefix: true });

  return (
    <Layout>
      <div
        className="py-5 container d-flex justify-content-center align-items-center"
        style={{ maxWidth: "50rem" }}
      >
        {token ? (
          <ResetPasswordForm token={token} userId={userid} expiry={expiry} />
        ) : (
          <ResetPasswordLinkForm email={email} />
        )}
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;
