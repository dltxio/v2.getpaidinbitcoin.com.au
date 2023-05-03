import React from "react";
<<<<<<< HEAD
import { Formik, Form } from "formik";
import { isEmail } from "validator";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import gpib from "apis/gpib";
import Card from "components/Card";
import ErrorMessage from "components/ErrorMessage";
import { useHistory } from "react-router-dom";
import "./RegisterForm.scss";
import IdemQRCode from "components/IdemQRCode";

const defaultValues = {
  email: ""
};

const validate = ({ email }) => {
  const requiredMsg = "This field is required";
  const errors = {};

  // Required fields
  if (!email) errors.email = requiredMsg;

  // Formatting
  if (!isEmail(email)) errors.email = "Please enter a valid email";

  return errors;
};

const IDEMRegisterForm = ({ initialValues: _iv, logo }) => {
  const initialValues = { ...defaultValues, ..._iv };
  const history = useHistory();
  const onSubmit = async (values, actions) => {
    try {
      await gpib.open.post(`/Idem?email=${values.email}`);

      history.push("/login");
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
    }
  };

  return (
    <Card style={{ width: 500, height: 410 }}>
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
            <IdemQRCode />
            <div className="mt-5">
              <Input
                name="email"
                placeholder="Please register with your IDEM email"
                disabled={initialValues?.email}
              />
            </div>
            <ErrorMessage error={errors.hidden} />
            <SubmitSpinnerButton
              submitText="Join with IDEM"
              isSubmitting={isSubmitting}
            />
          </Form>
        )}
      </Formik>
=======
import Card from "components/Card";
import "./RegisterForm.scss";
import IdemQRCode from "components/IdemQRCode";

const IDEMRegisterForm = ({ initialValues: _iv, logo }) => {

  return (
    <Card style={{ width: 500, height: 410 }}>
      <div></div>
      <div className="mb-5 mt-2 flex justify-content-center">
        <h3>Register with IDEM</h3>
      </div>
      <IdemQRCode />
      <div className="mt-5">
        <p>IDEM is a decentralised identity app using PGP and Verifiable Credentials.  Download from the App Store.</p>
      </div>
>>>>>>> development
    </Card>
  );
};

export default IDEMRegisterForm;
