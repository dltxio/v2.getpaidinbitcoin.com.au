const validatePhoneCode = ({ code }) => {
  const errors = {};
  if (String(code).length !== 6) errors.code = "Must be 6 characters";
  return errors;
};

export default validatePhoneCode;
