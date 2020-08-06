import React, { useReducer } from "react";
import SubmitSpinnerButton from "./forms/SubmitSpinnerButton";

const icons = {
  email: "mail-outline",
  sms: "phone-portrait-outline",
  customEmail: "cube-outline",
  done: "checkmark-outline",
  error: "close-outline"
};

const messages = {
  email: {
    default: "Email Pay Instructions to me",
    error: "Something went wrong. Try emailing instructions again?"
  }
  // sms: {
  //   default: "SMS Pay Instructions to me",
  //   error: "Something went wrong. Try sending instructions by SMS again?"
  // },
  // customEmail: {
  //   default: "Email Pay Instructions to another address",
  //   error: "Something went wrong. Try emailing instructions again?"
  // }
};

const reducer = (state, action) => {
  const { target, type, error } = action;
  const newState = { ...state };
  switch (type) {
    case "BEGIN":
      newState[target].isSending = true;
      newState[target].error = null;
      newState[target].isSent = false;
      return newState;
    case "DONE":
      newState[target].isSending = false;
      newState[target].isSent = true;
      newState[target].icon = icons.done;
      return newState;
    case "ERROR":
      newState[target].isSending = false;
      newState[target].isSent = false;
      newState[target].error = error;
      newState[target].icon = icons.error;
      newState[target].message = messages[target].error;
      return newState;
  }
};

const initialState = {
  email: {
    isSent: false,
    isSending: false,
    error: null,
    icon: icons.email,
    message: messages.email.default
  }
  // sms: {
  //   isSent: false,
  //   isSending: false,
  //   error: null,
  //   icon: icons.sms,
  //   message: messages.sms.default
  // },
  // customEmail: {
  //   isSent: false,
  //   isSending: false,
  //   error: null,
  //   icon: icons.customEmail,
  //   message: messages.customEmail.default
  // }
};

const actionSharedProps = {
  variant: "link",
  variant: "link",
  className: "mb-2",
  iconStyle: { fontSize: "120%" },
  block: false
};

const PayInformationActions = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const emailUserInstructions = async () => {
    try {
      dispatch({ target: "email", type: "BEGIN" });
      // TODO: api call here
      dispatch({ target: "email", type: "DONE" });
    } catch (error) {
      dispatch({ target: "email", type: "ERROR", error });
    }
  };

  return (
    <div>
      <SubmitSpinnerButton
        icon={state.email.icon}
        submitText={state.email.message}
        isSubmitting={state.email.isSending}
        onClick={emailUserInstructions}
        {...actionSharedProps}
      />
    </div>
  );
};

export default PayInformationActions;
