import React from "react";
import { Formik, Form } from "formik";
import { isNumeric } from "validator";
import SubmitButtonSpinner from "components/forms/SubmitSpinnerButton";
import ToggleButton from "components/forms/ToggleButton";
import ErrorMessage from "components/ErrorMessage";
import Input from "components/forms/Input";

const CreateBillForm = ({
  onSubmit,
  hasCustodialAddress,
  setPayWithCustodialWallet,
  isSubmitting,
  errorMessage,
  hideError
}) => {
  const custodialAddressNotFoundMessage = hasCustodialAddress
    ? ""
    : "(No active custodial wallet found)";

  const initialValues = {
    label: "",
    billercode: "",
    reference: "",
    fiat: 0
  };

  const validate = ({ billercode, reference, fiat }) => {
    const errors = {};
    const reqMsg = "This field is required";
    if (!billercode) errors.billercode = reqMsg;
    if (!reference) errors.ref = reqMsg;
    if (!isNumeric(String(fiat))) errors.fiat = "Amount must be a number";
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      <Form>
        <Input
          name="label"
          label="Label for your reference"
          placeholder="Rent, Power Bill, etc"
        />
        <Input name="billercode" label="Biller Code" />
        <Input name="reference" label="Ref" />
        <Input name="fiat" label="AUD Amount" />
        <div>
          <ToggleButton
            name="payWithGpibCustodialWallet"
            label={`Pay with GPIB custodial wallet ${custodialAddressNotFoundMessage}`}
            onClick={(e) => setPayWithCustodialWallet(e.target.checked)}
            disabled={!hasCustodialAddress}
          />
        </div>
        <SubmitButtonSpinner
          isSubmitting={isSubmitting}
          className="mt-3"
          submitText="Pay now with Bitcoin"
        />
        <ErrorMessage error={errorMessage} isHidden={hideError} />
      </Form>
    </Formik>
  );
};

export default CreateBillForm;
