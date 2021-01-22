import React, { useContext } from "react";
import { Formik, Form } from "formik";
import { isEmail } from "validator";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import gpib from "apis/gpib";
import ErrorMessage from "components/ErrorMessage";
import { AuthContext } from "components/auth/Auth";
import { minPasswordLength } from "constants/index";

const defaultValues = {
  email: "",
  password: "",
  passwordMatch: "",
  firstName: "",
  lastName: "",
  referralCode: ""
};

const parseSubmitValues = (v) => ({
  firstName: v.firstName,
  lastName: v.lastName,
  email: v.email,
  password: v.password,
  referralCode: v.referralCode,
  createHDAddress: true
});

const validate = ({ email, password, passwordMatch, firstName, lastName }) => {
  const requiredMsg = "This field is required";
  const errors = {};

  // Required fields
  if (!email) errors.email = requiredMsg;
  if (!password) errors.password = requiredMsg;
  if (!passwordMatch) errors.passwordMatch = requiredMsg;
  if (!firstName) errors.firstName = requiredMsg;
  if (!lastName) errors.lastName = requiredMsg;

  // Formatting
  if (!isEmail(email)) errors.email = "Please enter a valid email";
  if (password.length < minPasswordLength)
    errors.password = `Password must be at least ${minPasswordLength} characters`;

  // Password match
  if (password !== passwordMatch)
    errors.passwordMatch = "Passwords do not match";

  return errors;
};

const RegisterForm = ({ initialValues: _iv, lockReferralCode }) => {
  const initialValues = { ...defaultValues, ..._iv };
  const { login } = useContext(AuthContext);
  const onSubmit = async (values, actions) => {
    try {
      const parsedValues = parseSubmitValues(values);
      await gpib.open.post("/user", parsedValues);
      login({
        username: parsedValues.email,
        password: parsedValues.password
      });
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form style={{ flex: 1, width: "100%" }}>
          <Input
            name="email"
            placeholder="Please register with your own email"
          />
          <Input name="password" type="password" placeholder="Password" />
          <Input
            name="passwordMatch"
            type="password"
            placeholder="Confirm Password"
          />
          <Input name="firstName" placeholder="First Name" />
          <Input name="lastName" placeholder="Last Name" />
          <Input
            name="referralCode"
            placeholder="Offer or Referral Code"
            disabled={lockReferralCode}
          />
          <ErrorMessage error={errors.hidden} />
          <SubmitSpinnerButton submitText="Join" isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
