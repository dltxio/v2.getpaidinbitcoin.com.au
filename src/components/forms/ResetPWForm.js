import React, { useContext, useState } from "react";
import { Formik, Form } from "formik";
import { useHistory } from "react-router-dom";
import { Alert } from "react-bootstrap";
import gpib from "../../apis/gpib";
import Input from "./form-inputs/Input";
import SubmitSpinnerButton from "./SubmitSpinnerButton";
import { minPasswordLength } from "../../constants";
import { AuthContext } from "../Auth";

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

const ResetPWForm = ({ onSuccess, onError, email, token }) => {
  const { login, isLoggingIn } = useContext(AuthContext);
  const [password, setPassword] = useState(null);
  const history = useHistory();

  const wrappedLogin = async () => {
    if (email && password) await login({ email, password });
    history.push("/");
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
      setPassword({ email, password: values.password });
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
          <SubmitSpinnerButton
            submitText="Login"
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
          {({ isSubmitting }) => (
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

export default ResetPWForm;
