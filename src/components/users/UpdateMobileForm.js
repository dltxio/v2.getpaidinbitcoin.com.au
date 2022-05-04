import React, { useState } from "react";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import { Formik } from "formik";
import SingleInputForm from "components/forms/SingleInputForm";
import gpib from "apis/gpib";
import ErrorMessage from "components/ErrorMessage";
import { Button } from "react-bootstrap";
import validatePhoneCode from "components/forms/form-inputs/validate-mobile/validatePhoneCode";
import validatePhoneNumber from "components/forms/form-inputs/validate-mobile/validatePhoneNumber";

const UpdateMobileForm = ({ onSubmit, initialValues: _inititalValues }) => {
  const [hasSent, setSent] = useState(false);
  const sendSMS = async (values, actions) => {
    try {
      await gpib.secure.get(`/user/verifymobile?mobile=${values.mobile}`);
      actions.setSubmitting(false);
      setSent(true);
    } catch (e) {
      actions.setFieldError("hidden", e);
      actions.setSubmitting(false);
    }
  };
  const initialValues = {
    Name: "",
    Mobile: "",
    Email: "",
    FeesPerTransaction: ""
  };

  const renderCodeActions = (conf) => {
    const restart = () => {
      conf.resetForm();
      setSent(false);
    };

    return (
      <>
        <SubmitSpinnerButton
          submitText="Verify Code"
          _isSubmitting={conf._isSubmitting}
          block={false}
        />
        <Button
          className="ml-2"
          variant="link"
          children="I did not receive an sms"
          onClick={restart}
        />
      </>
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
      heading={"Update your mobile"}
    >
      {({ errors, value }) => (
        <>
          <SingleInputForm
            placeholder="Please enter your mobile number"
            onSubmit={sendSMS}
            submitText="Send Verification code"
            name="mobile"
            validate={validatePhoneNumber}
            style={{ display: hasSent ? "none" : undefined }}
          />
          <SingleInputForm
            placeholder="Please enter your 6-digit verification code"
            onSubmit={onSubmit}
            name="code"
            submitText="Verify code"
            validate={validatePhoneCode}
            style={{ display: hasSent ? undefined : "none" }}
            renderActions={renderCodeActions}
          />
          <ErrorMessage error={errors.hidden} />
        </>
      )}
    </Formik>
  );
};
export default UpdateMobileForm;
