import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { mutate } from "swr";
import { isMobilePhone } from "validator";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import SingleInputForm from "components/forms/SingleInputForm";
import gpib from "apis/gpib";

const VerifyEmail = () => {
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

  const verifyCode = async (values, actions) => {
    try {
      await gpib.secure.post("/user/verifymobile", {
        code: parseInt(values.code)
      });
      await mutate("/user/status");
      actions.setSubmitting(false);
    } catch (e) {
      actions.setFieldError("hidden", e);
      actions.setSubmitting(false);
    }
  };

  const validateMobile = ({ mobile }) => {
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
          isSubmitting={conf.isSubmitting}
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
    <div>
      <p>
        <b>Verify your mobile to continue.</b>
      </p>
      <SingleInputForm
        submitText="Send verification code"
        placeholder="Please enter your mobile number"
        onSubmit={sendSMS}
        name="mobile"
        validate={validateMobile}
        style={{ display: hasSent ? "none" : undefined }}
      />
      <SingleInputForm
        onSubmit={verifyCode}
        placeholder="Please enter your 6-digit verification code"
        submitText="Verify code"
        name="code"
        validate={validateCode}
        style={{ display: hasSent ? undefined : "none" }}
        renderActions={renderCodeActions}
      />
    </div>
  );
};

export default VerifyEmail;
