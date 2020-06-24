import React from "react";
import Loader from "../Loader";

const SubmitButtonSpinner = ({
  submitText,
  isSubmitting = false,
  ...props
}) => (
  <button
    className="btn btn-primary btn-block relative d-flex justify-content-center"
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
  </button>
);

export default SubmitButtonSpinner;
