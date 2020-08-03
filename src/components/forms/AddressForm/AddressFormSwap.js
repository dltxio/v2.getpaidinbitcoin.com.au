import React from "react";
import { Formik, Form } from "formik";
import Input from "../form-inputs/Input";
import SubmitSpinnerButton from "../SubmitSpinnerButton";
import ErrorMessage from "../../ErrorMessage";

const defaultInitialValues = {
  address: ""
};

const validate = ({ address }) => {
  const errors = {};
  const reqMsg = "This field is required";
  if (!address) errors.address = reqMsg;
  return errors;
};

const AddressFormSwap = ({
  initialValues = {},
  onSubmit,
  submitText = "Submit"
}) => {
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
          <Input
            name="address"
            label="New Address"
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          />
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

export default AddressFormSwap;