import React, { useContext, useState } from "react";
import { Formik, Form } from "formik";
import { useHistory } from "react-router-dom";
import { Alert } from "react-bootstrap";
import gpib from "../../apis/gpib";
import Input from "./form-inputs/Input";
import SubmitSpinnerButton from "./SubmitSpinnerButton";
import { minPasswordLength } from "../../constants";
import { AuthContext } from "../Auth";
import ErrorMessage from "../ErrorMessage";

const validate = ({ password, passwordMatch }) => {
  const requiredMsg = "This field is required";
  const errors = {};

  // Required fields
  if (!password) errors.password = requiredMsg;
  if (!passwordMatch) errors.passwordMatch = requiredMsg;

  // Formatting
  if (password.length < minPasswordLength)
    errors.password = `Password must be at least ${minPasswordLength} characters`;

  // Password match
  if (password !== passwordMatch)
    errors.passwordMatch = "Passwords do not match";

  return errors;
};

const initialValues = {
  password: "",
  passwordMatch: ""
};

const ResetPasswordForm = ({ onSuccess, onError, email, token }) => {
  const { login, isLoggingIn } = useContext(AuthContext);
  const [loginError, setLoginError] = useState(null);
  const [password, setPassword] = useState(null);
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const wrappedLogin = async () => {
    if (user) history.push("/");
    try {
      setLoginError(null);
      if (email && password) await login({ username: email, password });
      history.push("/");
    } catch (e) {
      setLoginError(e);
    }
  };

  const onSubmit = async (values, actions) => {
    try {
      await gpib.open.post(
        "/user/resetpassword",
        {
          password: values.password
        },
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );
      actions.setSubmitting(false);
      setPassword(values.password);
      if (onSuccess) onSuccess(values, actions);
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
      if (onError) onError(e);
    }
  };

  return (
    <div style={{ flex: 1, maxWidth: "65rem" }} className="container-fluid">
      {password ? (
        <>
          <Alert variant="primary">Your password has been reset</Alert>
          <ErrorMessage error={loginError} />
          <SubmitSpinnerButton
            submitText={user ? "Go to Dashboard" : "Login"}
            isSubmitting={isLoggingIn}
            onClick={wrappedLogin}
          />
        </>
      ) : (
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <Input
                name="password"
                placeholder="Enter a new password"
                type="password"
              />
              <Input
                name="passwordMatch"
                placeholder="Confirm your new password"
                type="password"
              />
              <ErrorMessage error={errors.hidden} />
              <SubmitSpinnerButton
                submitText="Reset Password"
                isSubmitting={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default ResetPasswordForm;
