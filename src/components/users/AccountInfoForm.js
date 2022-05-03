import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import ErrorMessage from "components/ErrorMessage";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";

const AccountInfoForm = ({
  onSubmit,
  submitText = "Update Account Setting",
  initialValues: _initialValues
}) => {
  const initialValues = {
    btcThreshold: "",
    ..._initialValues
  };

  const validate = (values) => {
    const errors = {};
    if (values.btcThreshold.toString().length === 0)
      errors.btcThreshold = "Please enter a BTC Threshold";
    else if (!(values.btcThreshold >= 0))
      errors.btcThreshold = "BTC Threshold cannot be less than $0.00";
    if (values.btcThreshold > 1000)
      errors.btcThreshold = "BTC Threshold must be at most $1000.00";
    if (values.btcThreshold % 1 !== 0)
      errors.btcThreshold = "BTC Threshold must be a whole dollar amount";
    return errors;
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
            label="BTC Threshold Amount (AUD)"
            name="btcThreshold"
            type="number"
            placeholder="$ AUD"
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

export default AccountInfoForm;
