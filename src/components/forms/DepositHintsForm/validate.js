const validate = (values) => {
  const requiredMsg = "This field is required";
  const errors = {};

  // Required fields
  if (!values.employerName) errors.employerName = requiredMsg;
  if (!values.depositAmount && String(values.depositAmount) !== "0")
    errors.depositAmount = requiredMsg;

  return errors;
};

export default validate;
