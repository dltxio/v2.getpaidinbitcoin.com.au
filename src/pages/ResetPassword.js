import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import ResetPWLinkForm from "../components/forms/ResetPWLinkForm";
import ResetPWForm from "../components/forms/ResetPWForm";

const ResetPassword = () => {
  const { token } = useParams();

  return (
    <Layout>
      <div className="py-5 container d-flex justify-content-center align-items-center">
        {token ? <ResetPWForm token={token} /> : <ResetPWLinkForm />}
      </div>
    </Layout>
  );
};

export default ResetPassword;
