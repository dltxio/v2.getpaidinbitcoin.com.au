import isMobilePhone from "validator/lib/isMobilePhone";

const validatePhoneNumber = ({ mobile }) => {
  const errors = {};
  if (!isMobilePhone(mobile, "en-AU"))
    errors.mobile = "Please enter a valid mobile number";
  return errors;
};

export default validatePhoneNumber;
