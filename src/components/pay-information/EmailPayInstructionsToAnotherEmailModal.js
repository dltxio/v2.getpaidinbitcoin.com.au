import React from "react";
import { Formik, Form } from "formik";
import { isEmail } from "validator";
import Input from "components/forms/Input";
import ErrorMessage from "components/ErrorMessage";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import Modal from "components/Modal";
import { Alert } from "react-bootstrap";

const validate = (values) => {
  const requiredMsg = "This field is required";
  const errors = {};

  if (!values.email) errors.email = requiredMsg;
  if (values.email && !isEmail(values.email))
    errors.email = "Invalid email address";
  return errors;
};

const EmailPayInstructionsToAnotherEmailModal = ({ isOpen, onSubmit, onDismiss, error, message }) => {
  const initialValues = {
    email: ""
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      heading="Email Pay Instructions To Another Email"
    >
      {({ onDismiss, wrapCallback }) => (
        <>
          {message ? (
            <Alert variant="success">
              {message}
            </Alert>
          ) : (
            <>
              <ErrorMessage error={error} />
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validate={validate}
                enableReinitialize
                onDismiss={onDismiss}
              >
                {({ isSubmitting, errors }) => (
                  <Form className="deposit-form">
                    <div className="mb-3">
                      <Input
                        name="email"
                        label="Email Address"
                        type="text"
                        placeholder="myemail@example.com"
                      />
                    </div>
                    <ErrorMessage error={errors.hidden} />
                    <SubmitSpinnerButton
                      submitText="Send"
                      isSubmitting={isSubmitting}
                      icon="mail-outline"
                    />
                  </Form>
                )}
              </Formik>
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default EmailPayInstructionsToAnotherEmailModal;
