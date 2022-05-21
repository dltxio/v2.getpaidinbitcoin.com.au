import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import ErrorMessage from "components/ErrorMessage";
import isNumeric from "validator/lib/isNumeric";

const defaultInitialValues = {
  percent: 100,
  label: "",
  address1: "",
  coin: "BTC",
  userID: ""
};
const validate = ({ label, address1, percent }) => {
  const errors = {};
  const reqMsg = "This field is required";
  if (!label) errors.label = reqMsg;
  if (!address1) errors.address1 = reqMsg;
  if (!isNumeric(percent.toString()))
    errors.percent = "Percent must be a number";
  if (Number(percent) < 0 || Number(percent) > 100)
    errors.percent = "Percent must be between 0 and 100";
  return errors;
};

const AddressGroupForm = ({ initialValues = {}, onSubmit, groupAddresses }) => {
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
          <Input name="label" label="Label" />
          {groupAddresses?.length === 0 && (
            <Input name="percent" label="Percent" type="text" />
          )}
          <Input
            name="address1"
            label="Address"
            disabled={iv.address1 ? true : false}
          />
          <ErrorMessage error={errors.hidden} />
          <SubmitSpinnerButton
            submitText="Submit"
            isSubmitting={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default AddressGroupForm;
