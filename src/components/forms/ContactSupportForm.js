import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import TextArea from "components/forms/TextArea";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import ErrorMessage from "components/ErrorMessage";

const defaultValues = { subject: "", body: "" };

const validate = ({ subject, body }) => {
  const errors = {};
  const requiredMsg = "This field is required";

  if (!subject) errors.subject = requiredMsg;
  if (!body) errors.body = requiredMsg;

  return errors;
};

const ContactSupportForm = ({
  initialValues,
  onSubmit,
  submitText = "Send",
  style,
  descriptionRows = 10,
  ...props
}) => {
  const initialValues = { ...defaultValues, ...initialValues };

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
            name="body"
            placeholder="Description"
            rows={descriptionRows}
          />
          <ErrorMessage error={errors.hidden} />
          <SubmitSpinnerButton
            submitText={submitText}
            isSubmitting={isSubmitting}
            className="mt-1"
          />
        </Form>
      )}
    </Formik>
  );
};

export default ContactSupportForm;
