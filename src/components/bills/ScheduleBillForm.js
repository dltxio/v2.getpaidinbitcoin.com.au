import React from "react";
import { Formik, Form } from "formik";
import { Alert } from "react-bootstrap";
import { isNumeric, isDecimal } from "validator";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import ErrorMessage from "components/ErrorMessage";

const defaultInitialValues = {
  label: "",
  billercode: "",
  ref: "",
  amount: 0,
  userID: "",
};

const validate = ({ label, billercode, ref, amount }) => {
  const errors = {};
  const reqMsg = "This field is required";
  if (!label) errors.label = reqMsg;
  if (!isNumeric(String(billercode))) errors.billercode = "Biller Code must be a number";
  if (!ref) errors.ref = reqMsg;
  if (!isDecimal(String(amount))) errors.amount = "Amount must be a number";
  return errors;
};

const ScheduleBillForm = ({
  initialValues = {},
  onSubmit,
  submitText = "Submit",
  omit: _omit = [],
  alert
}) => {
  const iv = { ...defaultInitialValues, ...initialValues };
  return (
    <Formik
      initialValues={iv}
      validate={validate}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, errors }) => (
        <Form>
          {alert && (
            <Alert variant="primary" className="mb-4">
              {alert}
            </Alert>
          )}
          <Input name="label" label="Label" placeholder="Rent, Power Bill, etc" />
          <Input
            name="billercode"
            label="Biller Code"
          />
          <Input
            name="ref"
            label="Ref"
          />
          <Input
            name="amount"
            label="AUD Amount"
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

export default ScheduleBillForm;
