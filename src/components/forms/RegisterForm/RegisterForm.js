import React, { useContext } from "react";
import { Formik, Form } from "formik";
import validate from "./validate";
import Input from "../form-inputs/Input";
import SubmitSpinnerButton from "../SubmitSpinnerButton";
import gpib from "../../../apis/gpib";
import ErrorMessage from "../../ErrorMessage";
import { AuthContext } from "../../Auth";

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
  referralCode: v.referralCode
});

const RegisterForm = ({ initialValues: _iv, lockReferralCode }) => {
  const initialValues = { ...defaultValues, ..._iv };
  const { login } = useContext(AuthContext);
  const onSubmit = async (values, actions) => {
    try {
      const parsedValues = parseSubmitValues(values);
      await gpib.open.post("/user", parsedValues);
      const { data: user } = await gpib.open.post("/user/authenticate", {
        email: parsedValues.email,
        password: parsedValues.password
      });
      login(user);
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
            placeholder="Referral Code"
            disabled={lockReferralCode}
          />
          <ErrorMessage error={errors.hidden} />
          <SubmitSpinnerButton
            variant="secondary"
            submitText="Join"
            isSubmitting={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
