import React from "react";
import Layout from "../components/Layout";
import LoginForm from "../components/forms/LoginForm";
import Card from "../components/Card";

const LoginPage = () => {
  return (
    <Layout className="login-page" navLinks={[]}>
      <div className="d-flex justify-content-center container py-5 align-items-center">
        <Card className="card-container">
          <LoginForm />
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
