import React, { useReducer } from "react";
import SubmitSpinnerButton from "./forms/SubmitSpinnerButton";

const reducer = (state, action) => {
  const { target, type, error } = action;
  switch (type) {
    case "BEGIN":
      const newState = { ...state };
      newState[target].isLoading = true;
      newState[target].error = null;
      newState[target].isSent = false;
      return newState;
    case "DONE":
      const newState = { ...state };
      newState[target].isLoading = false;
      newState[target].isSent = true;
      return newState;
    case "ERROR":
      const newState = { ...state };
      newState[target].isLoading = false;
      newState[target].isSent = false;
      newState[target].error = error;
      return newState;
  }
};

const initialState = {
  email: {
    isSent: false,
    isSending: false,
    error: null
  },
  sms: {
    isSent: false,
    isSending: false,
    error: null
  },
  customEmail: {
    isSent: false,
    isSending: false,
    error: null
  }
};

const PayInformationActions = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <SubmitSpinnerButton
        icon="mail-outline"
        submitText="Email Pay Instructions to me"
        variant="link"
        className="mb-2"
        iconStyle={{ fontSize: "120%" }}
        block={false}
        isSubmitting={true}
      />
      <br />
      <SubmitSpinnerButton
        icon="mail-outline"
        submitText="Email Pay Instructions to me"
        variant="link"
        className="mb-2"
        iconStyle={{ fontSize: "120%" }}
        block={false}
      />
      <br />
      <SubmitSpinnerButton
        icon="checkmark-outline"
        submitText="Email Pay Instructions to me"
        variant="link"
        className="mb-2"
        iconStyle={{ fontSize: "120%" }}
        block={false}
      />
      {/* <br />
      <Button variant="link" className="mb-2">
        <ion-icon name="phone-portrait-outline" />
        <span className="ml-3">SMS Pay Instructions to me</span>
      </Button>
      <br />
      <Button variant="link" className="mb-2">
        <ion-icon name="cube-outline" />
        <span className="ml-3">Email to another address</span>
      </Button> */}
    </div>
  );
};

export default PayInformationActions;
