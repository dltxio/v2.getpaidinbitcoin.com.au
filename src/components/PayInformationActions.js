import React, { useReducer, useContext } from "react";
import { isEmail } from "validator";
import SubmitSpinnerButton from "./forms/SubmitSpinnerButton";
import { AuthContext } from "./Auth";
import gpib from "../apis/gpib";
import ButtonInputSwitcher from "./ButtonInputSwitcher";

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
  },
  // sms: {
  //   default: "SMS Pay Instructions to me",
  //   error: "Something went wrong. Try sending instructions by SMS again?"
  // },
  customEmail: {
    default: "Email Pay Instructions to another address",
    error: "Something went wrong. Try emailing instructions again?"
  }
};

const reducer = (state, action) => {
  const { target, type, error } = action;
  const newState = { ...state };
  switch (type) {
    case "BEGIN":
      newState[target].message = messages[target].default;
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
    case "RESET":
      newState[target].isSending = false;
      newState[target].isSent = false;
      newState[target].error = null;
      newState[target].icon = icons[target];
      newState[target].message = messages[target].default;
      return newState;
    default:
    //  no default
  }
};

const initialState = {
  email: {
    isSent: false,
    isSending: false,
    error: null,
    icon: icons.email,
    message: messages.email.default
  },
  // sms: {
  //   isSent: false,
  //   isSending: false,
  //   error: null,
  //   icon: icons.sms,
  //   message: messages.sms.default
  // },SubmitSpinnerButton
  customEmail: {
    isSent: false,
    isSending: false,
    error: null,
    icon: icons.customEmail,
    message: messages.customEmail.default
  }
};

const actionSharedProps = {
  variant: "link",
  className: "mb-2",
  iconStyle: { fontSize: "120%" },
  block: false
};

const PayInformationActions = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useContext(AuthContext);

  const emailInstructionsToMe = async () => {
    await emailInstructions(user?.email, "email");
  };

  const emailInstructionsToOther = async (customEmail, actions) => {
    if (!isEmail(customEmail))
      return dispatch({
        target: "customEmail",
        type: "ERROR",
        error: "Invalid email"
      });
    actions.setInputShown(false);

    await emailInstructions(customEmail, "customEmail");
  };

  const emailInstructions = async (email, target) => {
    try {
      dispatch({ target, type: "BEGIN" });
      await gpib.secure.get(`/email/payinstructions/${user.id}?email=${email}`);
      dispatch({ target, type: "DONE" });
    } catch (error) {
      dispatch({ target, type: "ERROR", error });
    }
  };

  return (
    <div>
      <SubmitSpinnerButton
        icon={state.email.icon}
        submitText={state.email.message}
        isSubmitting={state.email.isSending}
        onClick={emailInstructionsToMe}
        {...actionSharedProps}
      />
      <br />
      <ButtonInputSwitcher
        icon={state.customEmail.icon}
        submitText={state.customEmail.message}
        isSubmitting={state.customEmail.isSending}
        onSubmit={emailInstructionsToOther}
        confirmText="Send"
        onCancel={() => dispatch({ type: "RESET", target: "customEmail" })}
        {...actionSharedProps}
      />
    </div>
  );
};

export default PayInformationActions;
