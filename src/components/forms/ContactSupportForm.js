import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import TextArea from "components/forms/TextArea";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import ErrorMessage from "components/ErrorMessage";

const defaultInitialValues = { subject: "", description: "" };

const validate = ({ subject, description }) => {
  const errors = {};
  const requiredMsg = "This field is required";

  if (!subject) errors.subject = requiredMsg;
  if (!description) errors.description = requiredMsg;

  return errors;
};

const ContactSupportForm = ({
  initialValues: iv,
  onSubmit,
  submitText = "Send",
  style,
  descriptionRows = 10,
  ...props
}) => {
  const initialValues = { ...defaultInitialValues, ...iv };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form style={{ flex: 1, width: "100%", ...style }} {...props}>
          <Input name="subject" placeholder="Subject" />
          <TextArea
            name="description"
            placeholder="Description"
            rows={descriptionRows}
          />
          <ErrorMessage error={errors.hidden} />
          <SubmitSpinnerButton
            submitText={submitText}
            isSubmitting={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default ContactSupportForm;
