import React, { useContext } from "react";
import { Redirect, useLocation, useHistory } from "react-router-dom";
import qs from "qs";
import { Button } from "react-bootstrap";
import { AuthContext } from "components/auth/Auth";
import Layout from "components/layout/Layout";
import Card from "components/Card";
import RegisterForm from "components/auth/RegisterForm";

const urlCheck = (firstName, lastName, email) => {
  if (firstName && lastName && email) {
    return true;
  } else {
    return false;
  }
};

const Register = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const location = useLocation();
  const referralCode =
    location?.search &&
    qs.parse(location.search, { ignoreQueryPrefix: true })?.referralCode;
  const firstName =
    location?.search &&
    qs.parse(location.search, { ignoreQueryPrefix: true })?.first;
  const lastName =
    location?.search &&
    qs.parse(location.search, { ignoreQueryPrefix: true })?.last;
  const email =
    location?.search &&
    qs.parse(location.search, { ignoreQueryPrefix: true })?.email;

  const enterprise = urlCheck(firstName, lastName, email);

  if (user) return <Redirect to="/" />;
  return (
    <Layout navLinks={[]}>
      <div className="d-flex justify-content-center container py-5 align-items-center">
        <Card
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ flex: 1, maxWidth: "40rem" }}
        >
          <RegisterForm
            enterprise={enterprise}
            initialValues={{ firstName, lastName, email, referralCode }}
            lockReferralCode={referralCode}
          />
          <Button
            block
            variant="link"
            className="mt-2"
            onClick={() => history.push("/login")}
          >
            Have an account? Log in
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
