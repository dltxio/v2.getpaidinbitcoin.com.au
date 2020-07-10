import React from "react";
import Loader from "../Loader";
import { Button } from "react-bootstrap";

const SubmitButtonSpinner = ({
  submitText,
  isSubmitting = false,
  ...props
}) => (
  <Button
    className="relative d-flex justify-content-center"
    variant="primary"
    block
    type="submit"
    disabled={isSubmitting}
    {...props}
  >
    <Loader
      loading={isSubmitting}
      noBackground
      noStretch
      light
      diameter="1.4rem"
    />
    <span className="mx-2">{submitText}</span>
  </Button>
);

export default SubmitButtonSpinner;
