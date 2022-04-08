import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import ErrorMessage from "components/ErrorMessage";

const defaultInitialValues = {
  percent: 100,
  label: "",
  address1: "",
  coin: "BTC",
  userID: ""
};
const validate = ({ label, address1 }) => {
  const errors = {};
  const reqMsg = "This field is required";
  if (!label) errors.label = reqMsg;
  if (!address1) errors.address1 = reqMsg;
  return errors;
};

const AddressGroupForm = ({ initialValues = {}, onSubmit }) => {
  const iv = { ...defaultInitialValues, ...initialValues };
  return (
    <Formik
      initialValues={iv}
      validate={validate}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <Input name="label" label="Label" />
          <Input
            name="address1"
            label="Address"
            disabled={iv.address1 ? true : false}
          />
          <ErrorMessage error={errors.hidden} />
          <SubmitSpinnerButton
            submitText="Submit"
            isSubmitting={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default AddressGroupForm;
