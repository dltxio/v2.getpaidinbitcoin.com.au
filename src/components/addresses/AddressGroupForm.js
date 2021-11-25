import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import ErrorMessage from "components/ErrorMessage";

const defaultInitialValues = {
  percent: 100,
  label: "",
  address1: "",
  coin: "BTC",
  userID: "",
  groupID: "default"
};
const validate = ({ groupID, label, address1 }) => {
  const errors = {};
  const reqMsg = "This field is required";
  if (!groupID) errors.groupID = reqMsg;
  if (!label) errors.label = reqMsg;
  if (!address1) errors.address1 = reqMsg;
  return errors;
};

const AddressGroupForm = ({ initialValues = {}, onSubmit }) => {
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
          {!iv.groupID && (
            <Input name="groupID" label="Group Name" disabled={iv.groupID} />
          )}
          <Input name="label" label="Label" />
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
