import { isEmail } from "validator";

const minPasswordLength = 6;

const validate = ({ email, password, passwordMatch, firstName, lastName }) => {
  const requiredMsg = "This field is required";
  const errors = {};

  // Required fields
  if (!email) errors.email = requiredMsg;
  if (!password) errors.password = requiredMsg;
  if (!passwordMatch) errors.passwordMatch = requiredMsg;
  if (!firstName) errors.firstName = requiredMsg;
  if (!lastName) errors.lastName = requiredMsg;

  // Formatting
  if (!isEmail(email)) errors.email = "Please enter a valid email";
  if (password.length < minPasswordLength)
    errors.password = `Password must be at least ${minPasswordLength} characters`;

  // Password match
  if (password !== passwordMatch)
    errors.passwordMatch = "Passwords do not match";

  return errors;
};

export default validate;
