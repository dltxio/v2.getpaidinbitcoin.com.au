import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import ErrorMessage from "components/ErrorMessage";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import isEmail from "validator/lib/isEmail";

const ReferralSendForm = ({
  initialValues: _inititalValues,
  onSubmit,
  submitText = "Send Referral"
}) => {
  const initialValues = {
    email: "",
    referralLink: "",
    ..._inititalValues
  };
  const validate = (values) => {
    const errors = {};
    if (!isEmail(values.email)) errors.email = "Please enter a valid email";
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
            label="Email"
            name="email"
            placeholder="Friend's emial address"
          />
          <Input label="Referral Link" name="referralLink" readOnly />
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
export default ReferralSendForm;
