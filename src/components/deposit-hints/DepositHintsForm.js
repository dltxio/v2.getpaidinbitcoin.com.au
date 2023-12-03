import React, { useState } from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import ErrorMessage from "components/ErrorMessage";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import isEmail from "validator/lib/isEmail";
import "./DepositHintsForm.scss";
import ToggleButton from "components/forms/ToggleButton";

const validate = (values) => {
  const re = /^[1-9]\d*(\.\d+)?$/;
  const requiredMsg = "This field is required";
  const depositAmountMsg = "Deposit Amount must be a valid currency amount.";
  const errors = {};

  // Required fields
  if (!values.employerName) errors.employerName = requiredMsg;
  if (!values.depositAmount) errors.depositAmount = requiredMsg;
  if (values.depositAmount && !re.test(values.depositAmount))
    errors.depositAmount = depositAmountMsg;
  if (!values.bankStatement) errors.bankStatement = requiredMsg;
  if (values.sendAnotherEmail && !values.emailToAnotherAddress)
    errors.emailToAnotherAddress = requiredMsg;
  if (
    values.sendAnotherEmail &&
    values.emailToAnotherAddress &&
    !isEmail(values.emailToAnotherAddress)
  )
    errors.emailToAnotherAddress = "Please enter a valid email address";
  return errors;
};

const DepositHintsForm = ({
  initialValues: _inititalValues,
  onSubmit,
  submitText,
  enterprise,
  sourceFrom
}) => {
  const [showAnotherAddressInput, setShowAnotherAddressInput] = useState(false);
  const initialValues = {
    employerName: "",
    depositAmount: "",
    bankStatement: "",
    sendInstructions: [],
    emailToAnotherAddress: "",
    sendAnotherEmail: "",
    ..._inititalValues
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
            label="Employer Name"
            name="employerName"
            placeholder="Example Pty Ltd"
            disabled={enterprise}
          />
          <Input
            label="Dollar amount of your wages you wish to receive in BTC"
            name="depositAmount"
            placeholder="100.00"
          />
          <Input
            label="Deposit Reference - Description or Reference that is on your regular wage bank statement."
            name="bankStatement"
            placeholder="Wage Transfer Description or Staff Number"
          />
          {sourceFrom && sourceFrom === "EditModal" && (
            <>
              <label>
                <ToggleButton
                  className="float-left"
                  name="sendInstructions"
                  value="sendEmail"
                />
                <label className="label-for-toggle-button">
                  Email Updated Pay Instructions to Me
                </label>
              </label>
              <label>
                <ToggleButton
                  className="float-left"
                  name="sendInstructions"
                  value="sendSMS"
                />
                <label className="label-for-toggle-button">
                  SMS Updated Pay Instructions to Me
                </label>
              </label>
              <label>
                <ToggleButton
                  className="float-left"
                  name="sendAnotherEmail"
                  onClick={(e) => setShowAnotherAddressInput(e.target.checked)}
                />
                <label className="label-for-toggle-button">
                  Email Updated Pay Instructions to Another Address
                </label>
              </label>
              {showAnotherAddressInput && (
                <Input
                  name="emailToAnotherAddress"
                  placeholder="Email Address"
                />
              )}
            </>
          )}

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

export default DepositHintsForm;
