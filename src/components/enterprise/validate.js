import { isEmail, isMobilePhone, isInt, isByteLength } from "validator";

const validate = (values) => {
  const requiredMsg = "This field is required";
  const errors = {};

  if (!values.name) errors.name = requiredMsg;
  if (!values.abn) errors.abn = requiredMsg;
  if (!values.emailDomain) errors.emailDomain = requiredMsg;
  if (!values.contactEmail) errors.contactEmail = requiredMsg;
  if (!values.contactPhoneNumber) errors.contactPhoneNumber = requiredMsg;
  if (!values.payrollContact) errors.payrollContact = requiredMsg;
  if (!values.payrollInformation) errors.payrollInformation = requiredMsg;
  if (!values.numberOfEmployers) errors.numberOfEmployers = requiredMsg;

  if (!isEmail(values.contactEmail))
    errors.contactEmail = "Please enter a valid email";

  if (!isMobilePhone(values.contactPhoneNumber, "en-AU"))
    errors.contactPhoneNumber = "Please enter a valid phone number";

  if (!isInt(values.numberOfEmployers))
    errors.numberOfEmployers = "Please enter a valid number of employers";

  if (
    !isByteLength(String(values.abn).trim().replace(/\s/gi, ""), {
      min: 11,
      max: 11
    })
  )
    errors.abn = "ABN number must be 11 numbers";

  return errors;
};

export default validate;
