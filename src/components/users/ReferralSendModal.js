import React, {useState} from "react";
import { Alert } from "react-bootstrap";
import Modal from "components/Modal";
import ReferralSendForm from "./ReferralSendForm";
import gpib from "apis/gpib";

const ReferralSendModal = ({isOpen, onDismiss}) => {
  const [message, setMessage] = useState(null);
    
  const onSubmit = async (values, formActions, modalActions) => {
    try {
      await gpib.secure.post("/referral/send", values);
      setMessage("Your referral link has been sent successfully to your friend's email address.");
    } catch (e) {
      formActions.setErrors({ hidden: e });
    }
    formActions.setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} heading="Send Referral Link">
      {({ onDismiss, wrapCallback }) => (
        <>
          <Alert variant="success" hidden={!message}>{message}</Alert>
          <ReferralSendForm
            onDismiss={onDismiss}
            onSubmit={wrapCallback(onSubmit)}
            submitText="Send Referral"
          />
        </>
      )}
    </Modal>
  );
};

export default ReferralSendModal;
