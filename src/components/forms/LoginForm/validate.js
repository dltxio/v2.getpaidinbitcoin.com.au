import { isEmail, trim } from "validator";

const validate = ({ username, password }) => {
  const errors = {};
  if (!isEmail(trim(username))) errors.username = "Please enter a valid email";
  if (!password) errors.password = "Please enter a password";
  return errors;
};

export default validate;
