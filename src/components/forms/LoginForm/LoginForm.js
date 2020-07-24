import React, { useContext } from "react";
import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import validate from "./validate";
import Input from "../form-inputs/Input";
import { AuthContext } from "../../Auth";
import SubmitSpinnerButton from "../SubmitSpinnerButton";

const LoginForm = ({
  initialValues = { username: "", password: "" },
  onLogin,
  style = {}
}) => {
  const { login } = useContext(AuthContext);
  const history = useHistory();
  const onSubmit = async (values, actions) => {
    try {
      await login(values);
      if (onLogin) onLogin(values);
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
        <Form
          className="login-form"
          style={{ flex: 1, width: "100%", ...style }}
        >
          <Input name="username" placeholder="Email" />
          <Input name="password" type="password" placeholder="Password" />
          <SubmitSpinnerButton
            submitText="Log in"
            isSubmitting={isSubmitting}
          />
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
