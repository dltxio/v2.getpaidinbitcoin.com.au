import React, { useState } from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import ErrorMessage from "components/ErrorMessage";
import validate from "./validate";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import gpib from "apis/gpib";
import { Alert } from "react-bootstrap";

const EnterprisesForm = ({ style = {} }) => {
  const [message, setMessage] = useState();
  const initialValues = {
    name: "",
    abn: "",
    emailDomain: "",
    contactEmail: "",
    contactPhoneNumber: "",
    payrollContact: "",
    payrollInformation: ""
  };

  const onSubmit = async (values, actions) => {
    try {
      actions.setSubmitting(true);
      await gpib.open.post("/Enterprise", values);
      setMessage(
        "We have received your application for the following enterprise registration with Get Paid In Bitcoin, thank you for your interest, we will get back to you soon"
      );
      actions.setSubmitting(false);
    } catch (error) {
      console.error(error);
      actions.setErrors(error);
      actions.setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      enableReinitialize
    >
      {({ isSubmitting, errors }) => (
        <Form
          className="enterprise-form"
          style={{ flex: 1, width: "100%", ...style }}
        >
          {message && <Alert variant="success">{message}</Alert>}

          <Input label="Name" name="name" />
          <Input label="ABN" name="abn" />
          <Input label="Email Domain" name="emailDomain" />
          <Input label="Contact Email" name="contactEmail" />
          <Input label="Contact Phone Number" name="contactPhoneNumber" />
          <Input label="Payroll Contact" name="payrollContact" />
          <Input label="Payroll Information" name="payrollInformation" />
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

export default EnterprisesForm;
