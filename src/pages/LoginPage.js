import React from 'react';
import Layout from '../components/Layout';
import LoginForm from '../components/forms/LoginForm';

const LoginPage = () => (
  <Layout noHeader>
    <div
      className="d-flex justify-content-center container py-5 align-items-center"
      style={{ height: '100vh' }}
    >
      <LoginForm />
    </div>
  </Layout>
);

export default LoginPage;
