import React, { useReducer, useContext, useState } from "react";
import { AuthContext } from "components/auth/Auth";
import EmailPayInstructionsToAnotherEmailModal from "./EmailPayInstructionsToAnotherEmailModal";
import gpib from "apis/gpib";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";

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
  sms: {
    default: "SMS Pay Instructions to me",
    error: "Something went wrong. Try sending instructions by SMS again?"
  },
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
  sms: {
    isSent: false,
    isSending: false,
    error: null,
    icon: icons.sms,
    message: messages.sms.default
  },
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
  iconStyle: { fontSize: "120%" }
};

const PayInformationActions = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendInstructionsToAnotherError, setSendInstructionsToAnotherError] =
    useState(null);
  const [
    sendInstructionsToAnotherMessage,
    setSendInstructionsToAnotherMessage
  ] = useState(null);
  const { user } = useContext(AuthContext);

  const smsInstructionsToMe = async () => {
    const target = "sms";
    try {
      dispatch({ target, type: "BEGIN" });
      await gpib.secure.post("/sms/payinstructions", { userID: user.id });
      dispatch({ target, type: "DONE" });
    } catch (error) {
      dispatch({ target, type: "ERROR", error });
    }
  };

  const emailInstructionsToMe = async () => {
    await emailInstructions(user?.email, "email");
  };

  const emailInstructionsToAnother = async (
    values,
    formActions,
    modalActions
  ) => {
    try {
      await emailInstructions(values.email, "customEmail");
      setSendInstructionsToAnotherMessage("Pay instructions sent successfully");
    } catch {
      formActions.setErrors({
        hidden: "Something went wrong. Try emailing instructions again?"
      });
      formActions.setSubmitting(false);
    }
  };

  const onModalDismiss = () => {
    setIsModalOpen(false);
    setSendInstructionsToAnotherError(null);
    setSendInstructionsToAnotherMessage(null);
  };

  const onClickEmailInstructionsToAnother = async () => {
    setSendInstructionsToAnotherError(null);
    setIsModalOpen(true);
  };

  const emailInstructions = async (email, target) => {
    try {
      dispatch({ target, type: "BEGIN" });
      await gpib.secure.post("/email/payinstructions", {
        userID: user.id,
        ToEmail: email
      });
      dispatch({ target, type: "DONE" });
    } catch (error) {
      dispatch({ target, type: "ERROR", error });
      setSendInstructionsToAnotherError(error);
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
      <SubmitSpinnerButton
        icon={state.sms.icon}
        submitText={state.sms.message}
        isSubmitting={state.sms.isSending}
        onClick={smsInstructionsToMe}
        {...actionSharedProps}
      />
      <br />
      <SubmitSpinnerButton
        icon={state.customEmail.icon}
        submitText={state.customEmail.message}
        isSubmitting={state.customEmail.isSending}
        onClick={onClickEmailInstructionsToAnother}
        {...actionSharedProps}
      />

      <EmailPayInstructionsToAnotherEmailModal
        isOpen={isModalOpen}
        error={sendInstructionsToAnotherError}
        message={sendInstructionsToAnotherMessage}
        onDismiss={onModalDismiss}
        onSubmit={emailInstructionsToAnother}
      />
    </div>
  );
};

export default PayInformationActions;
