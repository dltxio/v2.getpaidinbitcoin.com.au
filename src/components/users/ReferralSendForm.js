import React, { useContext } from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import ErrorMessage from "components/ErrorMessage";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import isEmail from "validator/lib/isEmail";
import { AuthContext } from "components/auth/Auth";

const ReferralSendForm = ({ onSubmit, submitText = "Send Referral" }) => {
  const { user } = useContext(AuthContext);
  const initialValues = {
    email: "",
    referralLink: `${process.env.REACT_APP_URL}/register?referralCode=${user.id}`
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
            placeholder="Friend's email address"
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
