import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import ErrorMessage from "components/ErrorMessage";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";

const AccountInfoForm = ({
  onSubmit,
  submitText = "Update Account Setting",
  initialValues: _inititalValues
}) => {
  const initialValues = {
    btcThreshold: "",
    ..._inititalValues
  };

  const validate = (values) => {
    const errors = {};
    if (!values.btcThreshold)
      errors.btcThreshold = "Please enter a BTC Threshold";
    if (!(Number(values.btcThreshold) > 0))
      errors.btcThreshold = "BTC Threshold can not be 0";
    if (Number(values.btcThreshold) > 1000)
      errors.btcThreshold = "Maximun of BTC Threshold is 1000 ";
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
          <Input label="BTC Threshold" name="btcThreshold" />
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
