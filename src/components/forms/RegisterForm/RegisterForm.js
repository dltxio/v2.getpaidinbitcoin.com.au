import React from "react";
import { Formik, Form } from "formik";
import validate from "./validate";
import Input from "../form-inputs/Input";
import SubmitSpinnerButton from "../SubmitSpinnerButton";

const defaultValues = {
  email: "",
  password: "",
  passwordMatch: "",
  firstName: "",
  lastName: "",
  referredBy: ""
};

const RegisterForm = ({ initialValues: _iv }) => {
  const initialValues = { ...defaultValues, ..._iv };
  const onSubmit = async (values, actions) => {
    try {
      // TODO: submit form to backend
      alert("Registered");
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: "error" });
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form style={{ flex: 1, width: "100%" }}>
          <Input
            name="email"
            placeholder="Please register with your own email"
          />
          <Input name="password" type="password" placeholder="Password" />
          <Input
            name="passwordMatch"
            type="password"
            placeholder="Confirm Password"
          />
          <Input name="firstName" placeholder="First Name" />
          <Input name="lastName" placeholder="Last Name" />
          <Input name="referredBy" placeholder="Referral Code" />
          <SubmitSpinnerButton
            variant="secondary"
            submitText="Join"
            isSubmitting={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
