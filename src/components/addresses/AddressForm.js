import React from "react";
import { Formik, Form } from "formik";
import { Alert } from "react-bootstrap";
import { isNumeric, isDecimal } from "validator";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import ErrorMessage from "components/ErrorMessage";

const defaultInitialValues = {
  percent: 100,
  label: "",
  address1: "",
  coin: "BTC",
  userID: "",
  groupID: ""
};

const validate = ({ percent, label, address1 }) => {
  const errors = {};
  const reqMsg = "This field is required";
  if (!percent) errors.percent = reqMsg;
  if (!label) errors.label = reqMsg;
  if (!address1) errors.address1 = reqMsg;
  if (!isNumeric(String(percent))) errors.percent = "Percent must be a number";
  if (Number(percent) < 0 || Number(percent) > 100)
    errors.percent = "Percent must be between 0 and 100";
  if (!isDecimal(String(percent), { decimal_digits: "0" }))
    errors.percent = "Percent can't be a decimal";
  return errors;
};

const AddressForm = ({
  initialValues = {},
  onSubmit,
  submitText = "Submit",
  omit: _omit = [],
  disablePercent,
  disableAddress,
  alert
}) => {
  const iv = { ...defaultInitialValues, ...initialValues };
  const omit = _omit.reduce((map, item) => {
    map[item] = true;
    return map;
  }, {});
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
          {!omit.percent && (
            <Input name="percent" label="Percent" disabled={disablePercent} />
          )}
          {!omit.label && (
            <Input
              name="label"
              label="Label"
              placeholder="Give your address a personal label"
            />
          )}
          {!omit.address1 && (
            <Input
              name="address1"
              label="BTC Address"
              disabled={disableAddress}
            />
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

export default AddressForm;
