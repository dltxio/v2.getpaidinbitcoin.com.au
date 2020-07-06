import React, { useContext } from "react";
import { Redirect, useLocation } from "react-router-dom";
import qs from "qs";
import { AuthContext } from "../components/Auth";
import Layout from "../components/Layout";
import LoginForm from "../components/forms/LoginForm";
import Card from "../components/Card";
import RegisterForm from "../components/forms/RegisterForm";
import "./LoginPage.scss";

const LoginPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const referralCode =
    location?.search &&
    qs.parse(location.search, { ignoreQueryPrefix: true })?.referralCode;
  if (user && !referralCode) return <Redirect to="/" />;
  return (
    <Layout className="login-page" navLinks={referralCode ? undefined : []}>
      <div className="d-flex justify-content-center container py-5 align-items-center">
        <Card className="card-container">
          <div className="row">
            {!referralCode && (
              <div className="col-sm">
                <h5>Existing Users</h5>
                <LoginForm />
              </div>
            )}
            <div className="col-sm">
              <h5>Register</h5>
              <RegisterForm
                initialValues={{ referralCode }}
                lockReferralCode={referralCode}
              />
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
