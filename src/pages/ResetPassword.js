import React from "react";
import { useParams, useLocation } from "react-router-dom";
import qs from "qs";
import Layout from "../components/Layout";
import ResetPWLinkForm from "../components/forms/ResetPWLinkForm";
import ResetPWForm from "../components/forms/ResetPWForm";

const ResetPassword = () => {
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
          <ResetPWForm token={token} email={email} />
        ) : (
          <ResetPWLinkForm email={email} />
        )}
      </div>
    </Layout>
  );
};

export default ResetPassword;
