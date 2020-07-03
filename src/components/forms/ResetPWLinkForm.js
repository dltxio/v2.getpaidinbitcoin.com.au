import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { isEmail } from "validator";
import gpib from "../../apis/gpib";
import Input from "./form-inputs/Input";
import SubmitSpinnerButton from "./SubmitSpinnerButton";
import { Alert } from "react-bootstrap";
import ErrorMessage from "../ErrorMessage";

const validate = ({ email }) => {
  const errors = {};
  if (!isEmail(email)) errors.email = "Please enter a valid email";
  return errors;
};

const ResetPWLinkForm = ({ initialValues = { email: "" } }) => {
  const [timer, setTimer] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const isDisabled = timer || timer === 0;

  const onSubmit = async (values, actions) => {
    try {
      await gpib.open.get(`/user/resetpassword?email=${values.email}`);
      setShowAlert(true);
      setTimer(60);
      actions.setSubmitting(false);
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    if ((timer || timer === 0) && timer >= 0) {
      setTimeout(() => {
        const newTimer = timer - 1;
        return newTimer < 0 ? setTimer(null) : setTimer(newTimer);
      }, 1000);
    }
  }, [timer]);

  const getSubmitText = () => {
    const actionTxt = showAlert ? "Resend" : "Send";
    let txt = `${actionTxt} Reset Password Link`;
    if (timer) txt += ` ${timer}`;
    return txt;
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form
          style={{ flex: 1, maxWidth: "65rem" }}
          className="container-fluid"
        >
          <Input
            name="email"
            placeholder="email"
            disabled={isDisabled || isSubmitting}
          />
          <ErrorMessage error={errors.hidden} />
          <SubmitSpinnerButton
            submitText={getSubmitText()}
            isSubmitting={isSubmitting}
            disabled={isDisabled || isSubmitting}
          />
          {showAlert && (
            <Alert variant="primary mt-3">
              A email has been sent to your nominated address with a link to
              reset your password. This link will expire in 1 hour. Please allow
              a few minutes for the email to arrive and check your spam folders.
            </Alert>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default ResetPWLinkForm;
