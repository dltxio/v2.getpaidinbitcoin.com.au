import React from "react";
import Layout from "../components/Layout";
import LoginForm from "../components/forms/LoginForm";

const LoginPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const referredBy =
    location?.search &&
    qs.parse(location.search, { ignoreQueryPrefix: true })?.referredBy;
  if (user && !referredBy) return <Redirect to="/" />;
  return (
    <Layout className="login-page" navLinks={[]}>
      <div className="d-flex justify-content-center container py-5 align-items-center">
        <Card className="card-container">
          <div className="row">
            {!referredBy && (
              <div className="col-sm">
                <LoginForm />
              </div>
            )}
            <div className="col-sm">
              <RegisterForm initialValues={{ referredBy }} />
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
