import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../components/Auth";
import Layout from "../components/Layout";
import LoginForm from "../components/forms/LoginForm";
import Card from "../components/Card";
import RegisterForm from "../components/forms/RegisterForm";
import "./LoginPage.scss";

const LoginPage = () => {
  const { user } = useContext(AuthContext);
  if (user) return <Redirect to="/" />;
  return (
    <Layout noHeader className="login-page">
      <div
        className="d-flex justify-content-center container py-5 align-items-center"
        style={{ height: "100vh" }}
      >
        <Card className="card-container">
          <div className="row">
            <div className="col-sm">
              <LoginForm />
            </div>
            <div className="col-sm">
              <RegisterForm />
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
