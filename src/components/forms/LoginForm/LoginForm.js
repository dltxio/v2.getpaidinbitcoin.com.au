import React, { useContext } from "react";
import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import validate from "./validate";
import gpib from "../../../apis/gpib";
import Input from "../form-inputs/Input";
import { AuthContext } from "../../Auth";
import SubmitSpinnerButton from "../SubmitSpinnerButton";

const LoginForm = ({
  initialValues = { username: "", password: "" },
  onLogin
}) => {
  const { login } = useContext(AuthContext);
  const history = useHistory();
  const onSubmit = async (values, actions) => {
    try {
      const { data: user } = await gpib.open.post("/user/authenticate", values);
      login(user);
      if (onLogin) onLogin();
    } catch (e) {
      console.log(e);
      actions.setErrors({
        password: "Unable to login. Please check your email or password."
      });
      actions.setSubmitting(false);
    }
  };

  const navToResetPassword = () => history.push("/auth/resetpassword");
  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="login-form" style={{ flex: 1, width: "100%" }}>
          <Input name="username" placeholder="email" />
          <Input name="password" type="password" placeholder="password" />
          <SubmitSpinnerButton submitText="Login" isSubmitting={isSubmitting} />
          <Button
            variant="light"
            block
            onClick={navToResetPassword}
            children="Reset Password"
          />
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
