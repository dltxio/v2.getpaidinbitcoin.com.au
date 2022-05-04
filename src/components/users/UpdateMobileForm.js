import React, { useState } from "react";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import { Formik } from "formik";
import SingleInputForm from "components/forms/SingleInputForm";
import gpib from "apis/gpib";
import ErrorMessage from "components/ErrorMessage";
import { Button } from "react-bootstrap";
import validatePhoneCode from "components/forms/form-inputs/validate-mobile.js/validatePhoneCode";
import validatePhoneNumber from "components/forms/form-inputs/validate-mobile.js/validatePhoneNumber";

const UpdateMobileForm = ({ onSubmit, initialValues: _inititalValues }) => {
  const [hasSent, setSent] = useState(false);
  const [setMessage] = useState();
  const sendSMS = async (values, actions) => {
    console.log(values);
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
    name: "",
    mobile: "",
    email: "",
    feesPerTransaction: ""
  };

  const verifyCode = async (values, actions) => {
    try {
      await gpib.secure.post("/user/verifymobile", {
        code: parseInt(values.code)
      });
      actions.setSubmitting(false);
      setMessage("Your mobile has been verified");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (e) {
      actions.setFieldError("hidden", e);
      actions.setSubmitting(false);
    }
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
      <div>
        {({ errors }) => (
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
              onSubmit={verifyCode}
              placeholder="Please enter your 6-digit verification code"
              name="code"
              submitText="Verify code"
              validate={validatePhoneCode}
              style={{ display: hasSent ? undefined : "none" }}
              renderActions={renderCodeActions}
            />
            <ErrorMessage error={errors.hidden} />
          </>
        )}
      </div>
    </Formik>
  );
};
export default UpdateMobileForm;
