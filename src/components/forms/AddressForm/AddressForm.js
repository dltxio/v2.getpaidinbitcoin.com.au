import React from "react";
import { Formik, Form } from "formik";
import validate from "./validate";
import Input from "../form-inputs/Input";
import validate from "./validate";
import SubmitSpinnerButton from "../SubmitSpinnerButton";

const defaultInitialValues = {};

const AddressForm = ({
  initialValues = {},
  onSubmit,
  submitText = "Submit"
}) => {
  const iv = { ...defaultInitialValues, ...initialValues };
  return (
    <Formik initialValues={iv} validate={validate} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className="login-form">
          <Input name="username" placeholder="email" />
          <Input name="password" type="password" placeholder="password" />
          <SubmitSpinnerButton
            submitText={submitText}
            isSubmitting={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default AddressForm;
