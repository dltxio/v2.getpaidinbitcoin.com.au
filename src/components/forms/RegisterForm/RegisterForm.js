import React from "react";
import { Formik, Form } from "formik";
import validate from "./validate";
import gpib from "../../../apis/gpib";
import Input from "../form-inputs/Input";
import SubmitSpinnerButton from "../SubmitSpinnerButton";

const RegisterForm = ({ initialValues = { username: "", password: "" } }) => {
  const onSubmit = async (values, actions) => {
    try {
      // const { data: user } = await gpib.open.post("/user/authenticate", values);
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: "error" });
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
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
          <Input name="referredBy" placeholder="Referral Code" />
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
