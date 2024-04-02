import React from "react";
import { Formik, Form } from "formik";
import { isNumeric } from "validator";
import SubmitButtonSpinner from "components/forms/SubmitSpinnerButton";
import ErrorMessage from "components/ErrorMessage";
import Input from "components/forms/Input";

const CreateBillForm = ({
  onSubmit,
  isSubmitting,
  errorMessage,
  hideError
}) => {
  const initialValues = {
    label: "",
    billercode: "",
    reference: "",
    fiat: null
  };

  const validate = ({ label, billercode, reference, fiat }) => {
    const errors = {};
    const reqMsg = "This field is required";
    if (!billercode) errors.billercode = reqMsg;
    if (!reference) errors.ref = reqMsg;
    if (!isNumeric(String(fiat))) errors.fiat = "Amount must be a number";

    if (label.length > 30)
      errors.label = "Label must be shorter than 30 characters";
    if (fiat > 10000000)
      errors.fiat = "AUD amount must be less than 10.000.000";
    if (fiat <= 0)
      errors.fiat = "AUD amount must be greater than 0";

    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      <Form>
        <Input
          name="label"
          label="Label for your reference"
          placeholder="Rent, Power Bill, etc"
        />
        <Input name="billercode" label="Biller Code" />
        <Input name="reference" label="Ref" />
        <Input name="fiat" label="AUD Amount" />
        <SubmitButtonSpinner
          isSubmitting={isSubmitting}
          className="mt-3"
          submitText="Pay now with Bitcoin"
        />
        <ErrorMessage error={errorMessage} isHidden={hideError} />
      </Form>
    </Formik>
  );
};

export default CreateBillForm;
