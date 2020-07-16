import React from "react";
import Loader from "../Loader";
import { Button } from "react-bootstrap";

const SubmitButtonSpinner = ({
  submitText,
  isSubmitting = false,
  icon,
  ...props
}) => (
  <Button
    variant="primary"
    block
    type="submit"
    disabled={isSubmitting}
    {...props}
  >
    <div className="relative d-flex justify-content-center align-items-center">
      <Loader
        loading={isSubmitting}
        noBackground
        noStretch
        light
        diameter="1.4rem"
      />
      {icon && !isSubmitting && (
        <ion-icon name={icon} style={{ fontSize: "150%" }} />
      )}
      <span className="mx-2">{submitText}</span>
    </div>
  </Button>
);

export default SubmitButtonSpinner;
