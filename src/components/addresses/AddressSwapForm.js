import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import ErrorMessage from "components/ErrorMessage";

const defaultValues = {
  address: "",
  label: ""
};

const validate = ({ address, label }) => {
  const errors = {};
  const reqMsg = "This field is required";
  if (!address) errors.address = reqMsg;
  if (!label) errors.label = reqMsg;
  return errors;
};

const AddressSwapForm = ({ onSubmit, submitText = "Submit", onDismiss }) => {
  return (
    <Formik
      initialValues={defaultValues}
      validate={validate}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <Input
            name="label"
            label="Label"
            placeholder="Give your address a personal label"
          />
          <Input name="address" label="New BTC Address" />
          <ErrorMessage error={errors.hidden} />
          <SubmitSpinnerButton
            submitText={submitText}
            isSubmitting={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default AddressSwapForm;
