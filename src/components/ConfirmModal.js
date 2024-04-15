import React, { useState } from "react";
import Modal from "components/Modal";
import ErrorMessage from "components/ErrorMessage";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";

const ConfirmModal = ({ onConfirm, onDismiss, confirmText, ...props }) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const wrapOnConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      await onConfirm();
      onDismiss();
      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  };
  return (
    <Modal onDismiss={onDismiss} {...props}>
      <ErrorMessage error={error} />
      <SubmitSpinnerButton
        isSubmitting={isLoading}
        onClick={wrapOnConfirm}
        submitText={confirmText}
      />
    </Modal>
  );
};

export default ConfirmModal;
