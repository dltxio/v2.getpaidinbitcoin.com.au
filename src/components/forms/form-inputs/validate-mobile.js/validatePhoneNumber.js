import isMobilePhone from "validator/lib/isMobilePhone";

const validatePhoneNumber = (phone) => {
  const errors = {};
  if (!phone.mobile) errors.mobile = "Please enter a valid mobile numbers";
  if (!isMobilePhone(phone.mobile, "en-AU"))
    errors.mobile = "Please enter a valid mobile number";
  return errors;
};

export default validatePhoneNumber;
