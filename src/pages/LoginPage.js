import React, { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { AuthContext } from "components/auth/Auth";
import Layout from "components/layout/Layout";
import LoginForm from "components/auth/LoginForm";
import Card from "components/Card";
// import { GoogleLogin } from "react-google-login-component";
// import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // const responseGoogle = (googleUser) => {
  //   console.log("responseGoogle");
  //   console.log(googleUser);

  //   const g_response = googleUser.getAuthResponse();
  //   console.log(g_response);
  //   // var googleId = googleUser.getId();

  //   // console.log({ g_resposne });
  //   // console.log({accessToken: id_token});
  // };

  const login = useGoogleLogin({
    clientId:
      "772977261943-mku9n12cbje2ndngtc0um30p2ed4n56e.apps.googleusercontent.com",
    onSuccess: (codeResponse) => {
      // setUser(codeResponse)
      console.log(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error)
  });

  useEffect(() => {
    /* global google */
    // google.accounts.id.initialize({
    //   client_id:
    //     "772977261943-mku9n12cbje2ndngtc0um30p2ed4n56e.apps.googleusercontent.com",
    //   callback: responseGoogle
    // });

    /* global google */
    google.accounts.id.renderButton(document.getElementById("google-login"), {
      theme: "outline",
      size: "large",
      locale: "en"
    });
  }, []);

  if (user) return <Navigate to="/" />;

  // const responseGoogle = (googleUser) => {
  //   console.log("responseGoogle");
  //   console.log(googleUser);

  //   const g_response = googleUser.getAuthResponse();
  //   console.log(g_response);
  //   // var googleId = googleUser.getId();

  //   // console.log({ g_resposne });
  //   // console.log({accessToken: id_token});
  // };

  return (
    <Layout navLinks={[]}>
      <div className="d-flex justify-content-center container py-5">
        <Card
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ flex: 1, maxWidth: "40rem", minHeight: "30rem" }}
        >
          <LoginForm style={{ flex: undefined }} />
          {/* <GoogleLogin
            socialId="772977261943-mku9n12cbje2ndngtc0um30p2ed4n56e.apps.googleusercontent.com"
            className="google-login"
            scope="profile"
            fetchBasicProfile={true}
            responseHandler={responseGoogle}
            buttonText="Login With Google"
          /> */}

          {/* <div id="google-login" className="google-login" /> */}

          <Button id="google-login" block variant="link" className="mt-2" onClick={login}>
            Google Login
          </Button>

          <Button
            block
            variant="link"
            className="mt-2"
            onClick={() => navigate("/register")}
          >
            Don't have an account? Register
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
