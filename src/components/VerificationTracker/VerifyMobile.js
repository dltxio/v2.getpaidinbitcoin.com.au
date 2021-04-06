import React, { useState, useContext } from "react";
import { Button, Alert } from "react-bootstrap";
import { mutate } from "swr";
import { isMobilePhone } from "validator";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import SingleInputForm from "components/forms/SingleInputForm";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";

const VerifyEmail = () => {
  const [hasSent, setSent] = useState(false);
  const { user, setVerified } = useContext(AuthContext);
  const [message, setMessage] = useState();

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
      actions.setSubmitting(false);
      setMessage("Your phone has been verified");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await mutate(`/user/${user.id}`);
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

  const skipKYC = () => {
    setVerified(true);
  };
  return (
    <div>
      <div>
        {message && <Alert variant="success">{message}</Alert>}
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
      <div className="mt-5 d-flex flex-row-reverse">
        <Button variant="primary" onClick={skipKYC}>
          Skip KYC
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
