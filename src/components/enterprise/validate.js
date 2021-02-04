import { isEmail } from "validator";

const validate = values => {
  const requiredMsg = "This field is required";
  const errors = {};

  if (!values.name) errors.name = requiredMsg;
  if (!values.abn) errors.abn = requiredMsg;
  if (!values.emailDomain) errors.emailDomain = requiredMsg;
  if (!values.contactEmail) errors.contactEmail = requiredMsg;
  if (!values.contactPhoneNumber) errors.contactPhoneNumber = requiredMsg;
  if (!values.payrollContact) errors.payrollContact = requiredMsg;
  if (!values.payrollInformation) errors.payrollInformation = requiredMsg;

  if (!isEmail(values.contactEmail))
    errors.contactEmail = "Please enter a valid email";

  return errors;
};

export default validate;
