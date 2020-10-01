import React from "react";
import { useParams, useLocation } from "react-router-dom";
import qs from "qs";
import Layout from "components/layout/Layout";
import ResetPasswordLinkForm from "components/auth/ResetPasswordLinkForm";
import ResetPasswordForm from "components/auth/ResetPasswordForm";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const location = useLocation();
  const { email } = qs.parse(location.search, { ignoreQueryPrefix: true });

  return (
    <Layout>
      <div
        className="py-5 container d-flex justify-content-center align-items-center"
        style={{ maxWidth: "50rem" }}
      >
        {token ? (
          <ResetPasswordForm token={token} email={email} />
        ) : (
          <ResetPasswordLinkForm email={email} />
        )}
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;
