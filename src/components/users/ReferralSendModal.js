import React from "react";
import Modal from "components/Modal";
import { useNavigate, useLocation } from "react-router-dom";
import ReferralSendForm from "./ReferralSendForm";
import gpib from "apis/gpib";

const ReferralSendModal = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const onDismiss = () => {
    const path = location.pathname.replace(/\/referral\/send/g, ""); //change url
    navigate(path);
  };
  const onSubmit = async (values, formActions, modalActions) => {
    try {
      await gpib.secure.post("/referral/send", values);
      modalActions.onDismiss();
    } catch (e) {
      console.error(e);
      formActions.setErrors({ hidden: e });
      formActions.setSubmitting(false);
    }
  };

  return (
    <Modal isOpen onDismiss={onDismiss} heading="Send Referral Link">
      {({ onDismiss, wrapCallback }) => (
        <>
          <ReferralSendForm
            onDismiss={onDismiss}
            onSubmit={wrapCallback(onSubmit)}
            submitText="Send Referral"
            {...props}
          />
        </>
      )}
    </Modal>
  );
};

export default ReferralSendModal;
