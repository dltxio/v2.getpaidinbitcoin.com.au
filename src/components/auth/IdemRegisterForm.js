import React, { useContext } from "react";
import { Formik, Form } from "formik";
import { isEmail } from "validator";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import gpib from "apis/gpib";
import ErrorMessage from "components/ErrorMessage";
import { AuthContext } from "components/auth/Auth";
import { useHistory } from "react-router-dom";
import QRCode from "qrcode.react";
import "./RegisterForm.scss"

const defaultValues = {
  email: ""
};

const parseSubmitValues = (v) => ({
  email: v.email
});

const validate = ({ email }) => {
  const requiredMsg = "This field is required";
  const errors = {};

  // Required fields
  if (!email) errors.email = requiredMsg;

  // Formatting
  if (!isEmail(email)) errors.email = "Please enter a valid email";

  return errors;
};

const IdemRegisterForm = ({ initialValues: _iv, logo }) => {
  const initialValues = { ...defaultValues, ..._iv };
  const { login } = useContext(AuthContext);
  const history = useHistory();

  const idemUrl = `did://callback=${process.env.REACT_APP_API_URL}/register/idem?nonce=8b5c66c0-bceb-40b4-b099-d31b127bf7b3&claims=EmailCredential,NameCredential`;

  const onSubmit = async (values, actions) => {
    try {
      const parsedValues = parseSubmitValues(values);
      await gpib.open.post("https://proxy.idem.com.au/", parsedValues);
      login({
        username: parsedValues.email,
      });
      history.push("/");
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
          <div className="">
            <QRCode value={idemUrl} size="200" />
          </div>
          <Input
            name="email"
            placeholder="Please register with your Idem email"
            disabled={initialValues?.email}
          />

          <ErrorMessage error={errors.hidden} />
          <SubmitSpinnerButton submitText="Join with Idem" isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
};

export default IdemRegisterForm;
