import React from "react";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import ErrorMessage from "components/ErrorMessage";

const noValidate = () => {
  return {};
};

const SingleInputForm = ({
  onSubmit,
  submitText,
  initialValues,
  style,
  validate,
  renderActions,
  name,
  placeholder,
  ...props
}) => {
  const submitButtonText = submitText || "Submit";
  if (!initialValues) initialValues = { [name]: "" };

  return (
    <Formik
      initialValues={{ [name]: "" }}
      validate={validate || noValidate}
      onSubmit={onSubmit}
    >
      {(conf) => (
        <Form style={{ flex: 1, width: "100%", ...style }} {...props}>
          <Input name={name} placeholder={placeholder} />
          <ErrorMessage error={conf.errors.hidden} />
          {typeof renderActions === "function" ? (
            renderActions(conf)
          ) : (
            <SubmitSpinnerButton
              submitText={submitButtonText}
              isSubmitting={conf.isSubmitting}
              block={false}
            />
          )}
        </Form>
      )}
    </Formik>
  );
};

export default SingleInputForm;
