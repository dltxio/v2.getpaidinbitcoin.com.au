import React, { useState } from "react";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import isMobilePhone from "validator/lib/isMobilePhone";
import { Formik } from "formik";
import SingleInputForm from "components/forms/SingleInputForm";
import gpib from "apis/gpib";
import ErrorMessage from "components/ErrorMessage";
import { Button } from "react-bootstrap";

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

  const validate = ({ mobile }) => {
    const errors = {};
    if (!isMobilePhone(mobile, "en-AU"))
      errors.mobile = "Please enter a valid mobile number";
    return errors;
  };

  const validateCode = ({ code }) => {
    const errors = {};
    if (String(code).length !== 6) errors.code = "Must be 6 characters";
    return errors;
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
      validate={validate}
      enableReinitialize
      heading={"Update your mobile"}
    >
      {({ _isSubmitting, errors }) => (
        <>
          <SingleInputForm
            placeholder="Please enter your mobile number"
            onSubmit={sendSMS}
            submitText="Send Verification code"
            name="mobile"
            validate={validate}
            style={{ display: hasSent ? "none" : undefined }}
          />
          <SingleInputForm
            placeholder="Please enter your 6-digit verification code"
            onSubmit={onSubmit}
            name="code"
            submitText="Verify code"
            validate={validateCode}
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
