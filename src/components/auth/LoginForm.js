import React, { useContext } from "react";
import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { isEmail, trim } from "validator";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import { AuthContext } from "components/auth/Auth";

const validate = ({ username, password }) => {
  const errors = {};
  if (!isEmail(trim(username))) errors.username = "Please enter a valid email";
  if (!password) errors.password = "Please enter a password";
  return errors;
};

const LoginForm = ({
  initialValues = { username: "", password: "" },
  onLogin,
  noReset,
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
          {!noReset && (
            <Button
              variant="light"
              block
              onClick={navToResetPassword}
              children="Reset Password"
            />
          )}
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
