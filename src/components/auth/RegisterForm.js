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

const defaultValues = {
  email: "",
  password: "",
  // passwordMatch: "",
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
  trackHDAddress: true,
  createHDAddress: true, // process.env.REACT_APP_LOBSTER_TRAP || true
});

const validate = ({ email, password, firstName, lastName }) => {
  const requiredMsg = "This field is required";
  const errors = {};

  // Required fields
  if (!email) errors.email = requiredMsg;
  if (!password) errors.password = requiredMsg;
  // if (!passwordMatch) errors.passwordMatch = requiredMsg;
  if (!firstName) errors.firstName = requiredMsg;
  if (!lastName) errors.lastName = requiredMsg;

  // Formatting
  if (!isEmail(email)) errors.email = "Please enter a valid email";
  if (password.length < minPasswordLength)
    errors.password = `Password must be at least ${minPasswordLength} characters`;

  // // Password match
  // if (password !== passwordMatch)
  //   errors.passwordMatch = "Passwords do not match";

  return errors;
};

const RegisterForm = ({
  initialValues: _iv,
  lockReferralCode,
  enterprise,
  logo
}) => {
  const initialValues = { ...defaultValues, ..._iv };
  const { login } = useContext(AuthContext);
  const history = useHistory();
  const onSubmit = async (values, actions) => {
    try {
      const parsedValues = parseSubmitValues(values);
      await gpib.open.post("/user", parsedValues);
      login({
        username: parsedValues.email,
        password: parsedValues.password
      });
      history.push("/");
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
    }
  };

  return (
    <Card style={{ width: 500 }}>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {logo && (
              <div className="mb-5 mt-2 flex justify-content-center">
                <img
                  src={`${process.env.REACT_APP_API_URL}/Logos/${logo}`}
                  alt="logo"
                  className="logo-image"
                />
              </div>
            )}

            <Input
              name="email"
              placeholder="Please register with your own email"
              disabled={initialValues?.email}
            />
            <Input name="password" type="password" placeholder="Password" />
            {/* <Input
              name="passwordMatch"
              type="password"
              placeholder="Confirm Password"
            /> */}
            <Input
              name="firstName"
              placeholder="First Name"
              disabled={initialValues?.firstName}
            />
            <Input
              name="lastName"
              placeholder="Last Name"
              disabled={initialValues?.lastName}
            />
            {!enterprise && (
              <Input
                name="referralCode"
                placeholder="Offer or Referral Code"
                disabled={lockReferralCode}
              />
            )}

            <ErrorMessage error={errors.hidden} />
            <SubmitSpinnerButton
              submitText="Join"
              isSubmitting={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default RegisterForm;
