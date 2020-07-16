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
        className="mr-2"
      />
      {icon && !isSubmitting && (
        <div className="mr-2 d-flex align-items-center">
          <ion-icon name={icon} style={{ fontSize: "150%" }} />
        </div>
      )}
      <span>{submitText}</span>
    </div>
  </Button>
);

export default SubmitButtonSpinner;
