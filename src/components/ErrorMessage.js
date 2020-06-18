import React from "react";
import { Alert } from "react-bootstrap";

const ErrorMessage = ({ error, isHidden, ...props }) => {
  let message = error;
  if (typeof error !== "string") {
    message = error?.message?.response?.error || error?.message;
  }

  return error && !isHidden ? (
    <Alert variant="danger" {...props}>
      {message}
    </Alert>
  ) : null;
};

export default ErrorMessage;
