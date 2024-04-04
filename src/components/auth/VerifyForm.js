import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import SubmitSpinnerButtonWithDisable from "components/forms/SubmitSpinnerButtonWithDisable";
import gpib from "apis/gpib";
import ErrorMessage from "components/ErrorMessage";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.scss";
import Selector from "components/forms/Selector";

const parseSubmitValues = (v) => ({
  dob: v.dob,
  streetNumber: v.streetNumber,
  street: v.streetName,
  suburb: v.suburb,
  state: v.state,
  country: v.country,
  postcode: v.postcode,
  driversLicenseNumber: v.driversLicenseNumber,
  driversLicenseCardNumber: v.driversLicenseCardNumber,
  medicareCardColour: "GREEN",
  medicareNumber: v.medicareNumber,
  medicareNameOnCard: v.medicareNameOnCard,
  medicareIndividualReferenceNumber: v.medicareIndividualReferenceNumber,
  medicareExpiry: v.medicareExpiry
});

const states = [
  ["QLD", "Queensland"],
  ["NSW", "New South Wales"],
  ["NT", "Northern Territory"],
  ["SA", "South Australia"],
  ["TAS", "Tasmania"],
  ["VIC", "Victoria"],
  ["WA", "Western Australia"]
];

const validate = ({
  dob,
  postcode,
  driversLicenseNumber,
  driversLicenseCardNumber,
  medicareNumber,
  medicareIndividualReferenceNumber,
  medicareExpiry,
  medicareNameOnCard
}) => {
  const requiredMsg = "This field is required";
  const errors = {};

  const postcodeRegex = new RegExp("^[0-9]{4}$");
  if (!postcodeRegex.test(postcode))
    errors.postcode = "Invalid postcode.  Please enter a 4 digit postcode";

  if (!driversLicenseNumber) errors.driversLicenseNumber = requiredMsg;
  if (!driversLicenseCardNumber) errors.driversLicenseCardNumber = requiredMsg;

  const medicareNumberRegex = new RegExp("^[0-9]{10}$");
  if (!medicareNumberRegex.test(medicareNumber))
    errors.medicareNumber =
      "Invalid Medicare Card Number.  Please enter a 10 digit Medicare Card Number";

  if (!medicareNameOnCard) errors.medicareNameOnCard = requiredMsg;

  const dobRegex = new RegExp("^[0-9]{2}/[0-9]{2}/[0-9]{4}$");
  if (!dobRegex.test(dob))
    errors.dob = "Invalid date of birth.  Please enter in format dd/mm/yyyy";

  const medicareIndividualReferenceNumberRegex = new RegExp("^[0-9]{1,2}$");
  if (
    !medicareIndividualReferenceNumberRegex.test(
      medicareIndividualReferenceNumber
    )
  )
    errors.medicareIndividualReferenceNumber =
      "Invalid Medicare Individual Reference Number.  Please enter a 1 or 2 digit Medicare Individual Reference Number";

  const medicareExpiryRegex = new RegExp("^[0-9]{2}/[0-9]{4}$");
  if (!medicareExpiryRegex.test(medicareExpiry))
    errors.medicareExpiry =
      "Invalid Medicare expiry.  Please enter in format mm/yyyy";

  return errors;
};

const VerifyForm = ({
  initialValues: _iv,
  setIdVerificationStatus,
  statuses,
  submitText = "Verify my ID"
}) => {
  const initialValues = { ..._iv };
  const navigate = useNavigate();
  const onSubmit = async (values, actions) => {
    try {
      const parsedValues = parseSubmitValues(values);
      let response = await gpib.secure.post(
        "/user/idemproxy/verify-claims",
        parsedValues
      );

      if (response.status === 200) {
        setIdVerificationStatus(statuses.VERIFIED);
      }
      if (response.status === 400) {
        setIdVerificationStatus(statuses.REJECTED);
      }
      setIdVerificationStatus(statuses.VERIFIED);
      navigate("/");
    } catch (e) {
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
      setIdVerificationStatus(statuses.REJECTED);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <Input name="dob" placeholder="DOB dd/mm/yyyy" />
          <Input name="streetNumber" placeholder="Street Number" />
          <Input name="streetName" placeholder="Street" />
          <Input name="suburb" placeholder="Suburb" />
          <Selector name="state" options={states} />
          <Input name="postcode" placeholder="Postcode" />
          <Input
            name="driversLicenseNumber"
            placeholder="Drivers License Number"
          />
          <Input
            name="driversLicenseCardNumber"
            placeholder="Drivers License Card Number"
          />
          <Input name="medicareNumber" placeholder="Medicare Card Number" />
          <Input
            name="medicareNameOnCard"
            placeholder="Medicare Name on Card"
          />
          <Input
            name="medicareIndividualReferenceNumber"
            placeholder="Medicare Individual Reference Number"
          />
          <Input name="medicareExpiry" placeholder="Medicare Expiry mm/yyyy" />
          <ErrorMessage error={errors.hidden} />
          <SubmitSpinnerButtonWithDisable
            submitText={submitText}
            isSubmitting={isSubmitting}
            isDisabled={false}
          />
        </Form>
      )}
    </Formik>
  );
};

export default VerifyForm;
