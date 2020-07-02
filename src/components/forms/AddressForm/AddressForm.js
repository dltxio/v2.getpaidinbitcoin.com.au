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
  submitText = "Submit"
}) => {
  const iv = { ...defaultInitialValues, ...initialValues };
  return (
    <Formik initialValues={iv} validate={validate} onSubmit={onSubmit}>
      {({ isSubmitting, errors }) => (
        <Form>
          <Alert variant="primary" className="mb-4">
            <b className="alert-heading">
              Your payment can be sent to multiple bitcoin addresses.
            </b>
            <span className="ml-2">
              For example, you may want to split your payment and send 50% to a
              cold storage wallet and 50% to a hot wallet. Please set the
              percentage required in the below field or leave at 100.
            </span>
          </Alert>
          <Input name="percent" label="Percent" />
          <Input name="label" label="Label" />
          <Input name="address1" label="Address" />
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
