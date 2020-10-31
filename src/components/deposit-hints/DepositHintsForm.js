import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import ErrorMessage from "components/ErrorMessage";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";

const validate = (values) => {
  const requiredMsg = "This field is required";
  const errors = {};

  // Required fields
  if (!values.employerName) errors.employerName = requiredMsg;
  if (!values.depositAmount && String(values.depositAmount) !== "0")
    errors.depositAmount = requiredMsg;

  return errors;
};

const DepositHintsForm = ({
  initialValues: _inititalValues,
  onSubmit,
  submitText = "Submit"
}) => {
  const initialValues = {
    employerName: "",
    depositAmount: "",
    ..._inititalValues
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      enableReinitialize
    >
      {({ isSubmitting, errors }) => (
        <Form className="deposit-form">
          <Input
            label="Employer Name"
            name="employerName"
            placeholder="Example Pty Ltd"
          />
          <Input
            label="Deposit Amount (AUD)"
            name="depositAmount"
            placeholder="0.00"
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

export default DepositHintsForm;
