import React from "react";
import { Formik, Form } from "formik";
import validate from "./validate";
import Input from "../form-inputs/Input";
import SubmitSpinnerButton from "../SubmitSpinnerButton";
import ErrorMessage from "../../ErrorMessage";
import { Alert } from "react-bootstrap";

const defaultInitialValues = {
  percent: 100,
  label: "",
  address1: "",
  coin: "BTC",
  userID: ""
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
              label="Address"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
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
