import React from "react";
import { Formik, Form } from "formik";
import Input from "../form-inputs/Input";
import ErrorMessage from "../../ErrorMessage";
import validate from "./validate.js";
import SubmitSpinnerButton from "../SubmitSpinnerButton";

const DepositHintsForm = ({
  initialValues: _inititalValues,
  onSubmit,
  submitText = "Submit"
}) => {
  const initialValues = {
    employerName: "",
    depositAmount: "",
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
          />
          <Input
            label="Deposit Amount (AUD)"
            name="depositAmount"
            placeholder="0.00"
          />
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
