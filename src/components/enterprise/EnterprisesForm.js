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
    numberOfEmployees: ""
  };

  const onSubmit = async (values, actions) => {
    try {
      actions.setSubmitting(true);
      await gpib.open.post("/Enterprise", parseSubmitValues(values));
      setMessage(
        "We have received your application for enterprise registration with Get Paid In Bitcoin. Thank you for your interest and we will get back to you soon"
      );
      actions.setSubmitting(false);
    } catch (error) {
      console.error(error);
      actions.setErrors({ hidden: error });
      actions.setSubmitting(false);
    }
  };
  const parseSubmitValues = (v) => ({
    name: v.name,
    abn: String(v.abn).trim().replace(/\s/gi, ""),
    emailDomain: v.emailDomain,
    contactEmail: v.contactEmail,
    contactPhoneNumber: v.contactPhoneNumber,
    payrollContact: v.payrollContact,
    numberOfEmployees: Number(v.numberOfEmployees)
  });
  const formatABN = (val) => {
    return val
      .trim()
      .replace(/\s/gi, "")
      .slice(0, 11)
      .split("")
      .map((el, idx) => {
        if (idx === 2 || idx === 5 || idx === 8) return ` ${el}`;
        return el.toString();
      })
      .reduce((acc, el) => acc + el, "");
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      enableReinitialize
    >
      {({ isSubmitting, errors, setFieldValue }) => (
        <Form
          className="enterprise-form"
          style={{ flex: 1, width: "100%", ...style }}
        >
          {message && <Alert variant="success">{message}</Alert>}
          <Input label="Business Name" name="name" />
          <Input
            label="ABN"
            name="abn"
            onKeyUp={(e) => {
              const val = e.target.value;
              e.target.value = formatABN(val);
              setFieldValue("abn", formatABN(val));
            }}
          />
          <Input label="Domain Name" name="emailDomain" />
          <Input label="Contact Email" name="contactEmail" />
          <Input label="Contact Mobile" name="contactPhoneNumber" />
          <Input label="Contact Name" name="payrollContact" />
          <Input label="Number of Employees" name="numberOfEmployees" />
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
