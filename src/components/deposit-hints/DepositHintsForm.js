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
  if (!values.bankStatement) errors.bankStatement = requiredMsg;
  return errors;
};

const DepositHintsForm = ({
  initialValues: _inititalValues,
  onSubmit,
  submitText = "Submit",
  enterprise
}) => {
  const initialValues = {
    employerName: "",
    depositAmount: "",
    bankStatement: "",
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
            disabled={enterprise}
          />
          <Input
            label="Dollar Amount of your Wages to Receive in BTC"
            name="depositAmount"
            placeholder="0.00"
          />
          <Input
            label="Deposit Reference (Wage transfer description or staff number as it appears on your bank statement)"
            name="bankStatement"
            placeholder="Wage Transfer Description or Staff Number"
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
