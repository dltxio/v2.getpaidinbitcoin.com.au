import React, { useContext } from "react";
import { Formik, Form } from "formik";
import { isEmail } from "validator";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import gpib from "apis/gpib";
import Card from "components/Card";
import ErrorMessage from "components/ErrorMessage";
import { AuthContext } from "components/auth/Auth";
import { minPasswordLength } from "constants/index";
import { useHistory } from "react-router-dom";
import "./RegisterForm.scss";

const parseSubmitValues = (v) => ({
  firstName: v.firstName,
  lastName: v.lastName,
  email: v.email
});

const validate = ({ email, password, passwordMatch, firstName, lastName }) => {
  const requiredMsg = "This field is required";
  const errors = {};

  // Required fields
  // if (!dob) errors.email = requiredMsg;
  if (!password) errors.password = requiredMsg;
  if (!firstName) errors.firstName = requiredMsg;
  if (!lastName) errors.lastName = requiredMsg;

  // Formatting
  if (!isEmail(email)) errors.email = "Please enter a valid email";
  if (password.length < minPasswordLength)
    errors.password = `Password must be at least ${minPasswordLength} characters`;

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
      await gpib.open.post("/user/idemproxy/verify", parsedValues);
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
              name="street"
              placeholder="House Number and Street"
            />
            <Input
              name="suburb"
              placeholder="Suburb"
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
