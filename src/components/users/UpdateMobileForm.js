import React, { useState } from "react";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import { Formik } from "formik";
import SingleInputForm from "components/forms/SingleInputForm";
import gpib from "apis/gpib";
import ErrorMessage from "components/ErrorMessage";
import { Button } from "react-bootstrap";
import validatePhoneCode from "components/forms/form-inputs/validate-mobile/validatePhoneCode";
import validatePhoneNumber from "components/forms/form-inputs/validate-mobile/validatePhoneNumber";

const UpdateMobileForm = ({
  onSubmit: verifySmsCode,
  initialValues: _inititalValues
}) => {
  const step = {
    START: 1,
    SENT_CODE: 2
  };
  const [currentStep, setCurrentStep] = useState(step.START);

  const sendSMS = async (values, actions) => {
    try {
      await gpib.secure.get(`/user/verifymobile?mobile=${values.mobile}`);
      setCurrentStep(step.SENT_CODE);
    } catch (e) {
      actions.setFieldError("hidden", e);
    }
    actions.setSubmitting(false);
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
      setCurrentStep(step.START);
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

  const wrapVerifySmsCode = async (values, formActions, modalActions) => {
    const success = await verifySmsCode(values, formActions, modalActions);
    if (success) {
      setCurrentStep(step.START);
    }
    formActions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={verifySmsCode}
      enableReinitialize
      heading={"Update your mobile"}
    >
      {({ errors }) => (
        <>
          <SingleInputForm
            placeholder="Please enter your mobile number"
            onSubmit={sendSMS}
            submitText="Send verification code"
            name="mobile"
            validate={validatePhoneNumber}
            style={{ display: currentStep === step.START ? undefined : "none" }}
          />
          <SingleInputForm
            placeholder="Please enter your 6-digit verification code"
            onSubmit={wrapVerifySmsCode}
            name="code"
            submitText="Verify code"
            validate={validatePhoneCode}
            style={{
              display: currentStep === step.SENT_CODE ? undefined : "none"
            }}
            renderActions={renderCodeActions}
          />
          <ErrorMessage error={errors.hidden} />
        </>
      )}
    </Formik>
  );
};
export default UpdateMobileForm;
