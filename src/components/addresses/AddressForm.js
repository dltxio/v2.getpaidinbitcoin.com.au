import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Alert } from "react-bootstrap";
import { isNumeric, isDecimal } from "validator";
import Selector from "components/forms/Selector";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import ErrorMessage from "components/ErrorMessage";

const defaultValues = {
  percent: 100,
  label: "",
  address1: "",
  coin: "BTC",
  userID: "",
  groupID: "",
  isCustodial: "non-custodial"
};

const validate = ({ percent, label, address1 }) => {
  const errors = {};
  const reqMsg = "This field is required";
  if (!percent) errors.percent = reqMsg;
  if (!label) errors.label = reqMsg;
  // if (!address1) errors.address1 = reqMsg;
  if (!isNumeric(String(percent))) errors.percent = "Percent must be a number";
  if (Number(percent) < 0 || Number(percent) > 100)
    errors.percent = "Percent must be between 0 and 100";
  if (!isDecimal(String(percent), { decimal_digits: "0" }))
    errors.percent = "Percent can't be a decimal";
  return errors;
};

const types = [
  // format: [value, label]
  ["non-custodial", "Personal Address"],
  ["custodial", "Custodial Held by GPIB"]
];

const AddressForm = ({
  initialValues = {},
  onSubmit,
  submitText = "Submit",
  omitList = [],
  disableList = [],
  alert
}) => {

  const iv = { ...defaultValues, ...initialValues, isCustodial: initialValues.isCustodial === true ? "custodial" : "non-custodial" };
  omitList = omitList.reduce((map, item) => {
    map[item] = true;
    return map;
  }, {});

  const [disabledAddressInput, setDisabledAddressInput] = useState(false);
  const handleSelectionChange = (event) => {
    const custodialSelected = event.target.value === "custodial";
    setDisabledAddressInput(custodialSelected);
  };

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
          {!omitList.percent && (
            <Input
              name="percent"
              label="Percent"
              disabled={disableList.percent}
            />
          )}
          {!omitList.label && (
            <Input
              name="label"
              label="Label"
              placeholder="Give your address a personal label"
            />
          )}
          {!omitList.type && (
            <Selector
              label={"Wallet type"}
              name="isCustodial"
              options={types}
              onClick={handleSelectionChange}
              disabled={disableList.isCustodial }
            />
          )}
          {!omitList.address1 && (
            <Input
              name="address1"
              label="BTC Address"
              disabled={disabledAddressInput}
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
