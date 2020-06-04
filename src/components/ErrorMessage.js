import React from "react";
import { Alert } from "react-bootstrap";

const ErrorMessage = ({ error, isHidden, ...props }) =>
  error && !isHidden ? (
    <Alert variant="danger" {...props}>
      {error}
    </Alert>
  ) : null;

export default ErrorMessage;
