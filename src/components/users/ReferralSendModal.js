import React from "react";
import Modal from "components/Modal";
import { useHistory, useLocation } from "react-router-dom";
import ReferralSendForm from "./ReferralSendForm";

const ReferralSendModal = (props) => {
  const history = useHistory();
  const location = useLocation();
  const onDismiss = () => {
    const path = location.pathname.replace(/\/payroll\/edit/g, ""); //change url
    history.push(path);
  };
  const onSubmit = async () => {};

  return (
    <Modal isOpen onDismiss={onDismiss} heading="Update Payroll Information">
      {({ onDismiss, wrapCallback }) => (
        <>
          <ReferralSendForm
            onDismiss={onDismiss}
            onSubmit={wrapCallback(onSubmit)}
            submitText="Save"
            {...props}
          />
        </>
      )}
    </Modal>
  );
};

export default ReferralSendModal;
