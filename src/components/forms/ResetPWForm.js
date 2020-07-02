import React from "react";
import { Formik, Form } from "formik";
// import gpib from "../../apis/gpib";
import Input from "./form-inputs/Input";
import SubmitSpinnerButton from "./SubmitSpinnerButton";
import { minPasswordLength } from "../../constants";

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

const ResetPWForm = ({ onSuccess, onError, token }) => {
  const onSubmit = async (values, actions) => {
    try {
      // TODO: get email from server
      console.log(values);
      actions.setSubmitting(false);
      if (onSuccess) onSuccess(values, actions);
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
      if (onError) onError(e);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form
          style={{ flex: 1, maxWidth: "65rem" }}
          className="container-fluid"
        >
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
  );
};

export default ResetPWForm;
