import React from "react";
import Loader from "components/Loader";
import { Button } from "react-bootstrap";

const SubmitSpinnerButton = ({
  submitText,
  isSubmitting = false,
  icon,
  iconStyle,
  spaceBetween = "1rem",
  ...props
}) => (
  <Button
    variant="primary"
    block
    type="submit"
    disabled={isSubmitting}
    className="mt-3 w-100 d-flex justify-content-center"
    {...props}
  >
    <div className="relative d-flex justify-content-center align-items-center">
      <Loader
        loading={isSubmitting}
        noBackground
        noStretch
        light
        diameter="1.4rem"
        style={{ marginRight: spaceBetween }}
      />
      {icon && !isSubmitting && (
        <div
          className="d-flex align-items-center"
          style={{ marginRight: spaceBetween }}
        >
          <ion-icon name={icon} style={{ fontSize: "150%", ...iconStyle }} />
        </div>
      )}
      <span>{submitText}</span>
    </div>
  </Button>
);

export default SubmitSpinnerButton;
