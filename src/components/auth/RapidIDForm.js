import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import Selector from "components/forms/Selector";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import ErrorMessage from "components/ErrorMessage";

const defaultValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  mobile: "",
  yob: undefined
};

const yearOptions = [-1, ...Array(100).keys()].map((num) => {
  if (num < 0) return [null, "Year of Birth"];
  const year = new Date().getFullYear() - num;
  return [year, year];
});

const validate = ({ firstName, lastName, yob }) => {
  const errors = {};
  const requiredMsg = "This field is required";
  if (!firstName) errors.firstName = requiredMsg;
  if (!lastName) errors.lastName = requiredMsg;
  if (!yob) errors.yob = requiredMsg;
  return errors;
};

const RapidIDForm = ({
  onSubmit,
  initialValues: iv,
  submitText = "Send Verification SMS"
}) => {
  const initialValues = { ...defaultValues, ...iv };
  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <Input
            name="firstName"
            label="First Name as displayed on ID"
            placeholder="First Name"
          />
          <Input
            name="middleName"
            label="Middle Name as displayed on ID"
            placeholder="Middle Name"
          />
          <Input
            name="lastName"
            label="Last Name as displayed on ID"
            placeholder="Last Name"
          />
          <Input
            name="mobile"
            label="Mobile Number"
            placeholder="xxxx xxx xxx"
            disabled
          />
          <Selector name="yob" label="Year of Birth" options={yearOptions} />
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

export default RapidIDForm;
