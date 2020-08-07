const validate = ({ firstName, lastName, yob }) => {
  const errors = {};
  const requiredMsg = "This field is required";
  if (!firstName) errors.firstName = requiredMsg;
  if (!lastName) errors.lastName = requiredMsg;
  if (!yob) errors.yob = requiredMsg;
  return errors;
};

export default validate;
