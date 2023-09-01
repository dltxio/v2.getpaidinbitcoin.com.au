import React, { useContext } from "react";
import { Formik, Form } from "formik";
// import { isEmail } from "validator";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import gpib from "apis/gpib";
import Card from "components/Card";
import ErrorMessage from "components/ErrorMessage";
import { AuthContext } from "components/auth/Auth";
import { useHistory } from "react-router-dom";
import "./RegisterForm.scss";

const parseSubmitValues = (v) => ({
  driversLicenseNumber: v.driversLicenseNumber,
  driversLicenseCardNumber: v.driversLicenseCardNumber,
  medicareCardColour: "GREEN",
  medicarenumber: v.medicareNumber,
  medicarenameOnCard: v.medicarenameOnCard,
  medicareindividualReferenceNumber: v.medicareIndividualReferenceNumber,
  medicareexpiry: v.medicareExpiry
});

const validate = ({ dob, driversLicenseNumber, driversLicenseCardNumber, medicareNumber, medicareNameOnCard }) => {
  const requiredMsg = "This field is required";
  const errors = {};

  // Required fields
  if (!dob) errors.email = requiredMsg;
  if (!driversLicenseNumber) errors.lastName = requiredMsg;
  if (!driversLicenseCardNumber) errors.lastName = requiredMsg;
  if (!medicareNumber) errors.lastName = requiredMsg;
  if (!medicareNameOnCard) errors.lastName = requiredMsg;

  // TODO: REGEX INPUT VALUES

  return errors;
};

const VerifyForm = ({
  initialValues: _iv
}) => {
  const initialValues = { ..._iv };
  // const { login } = useContext(AuthContext);
  const history = useHistory();
  const onSubmit = async (values, actions) => {
    try {
      const parsedValues = parseSubmitValues(values);
      await gpib.secure.post("/user/idemproxy/verify-claims", parsedValues);
      // login({
      //   username: parsedValues.email,
      //   password: parsedValues.password
      // });
      history.push("/");
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
    }
  };

  return (
    <Card style={{ width: 800 }}>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <Input
              name="dob"
              placeholder="DOB dd/mm/yyyy"
            />
            <Input
              name="driversLicenseNumber"
              placeholder="Drivers License Number"
            />
            <Input
              name="driversLicenseCardNumber"
              placeholder="Drivers License Card Number"
            />
            <Input
              name="medicareNumber"
              placeholder="Medicare Card Number"
            />
            <Input
              name="medicareNameOnCard"
              placeholder="Medicare Name on Card"
            />
            <Input
              name="medicareIndividualReferenceNumber"
              placeholder="Medicare Individual Reference Number"
            />
            <Input
              name="medicareExpiry"
              placeholder="Medicare Expiry mm/yyyy"
            />
            <ErrorMessage error={errors.hidden} />
            <SubmitSpinnerButton
              submitText="Verify"
              isSubmitting={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default VerifyForm;
