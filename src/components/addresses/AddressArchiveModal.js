import React, { useContext, useState } from "react";
import { mutate } from "swr";
import { AuthContext } from "components/auth/Auth";
import gpib from "apis/gpib";
import Modal from "components/Modal";
import ErrorMessage from "components/ErrorMessage";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";

const AddressArchiveModal = ({ isOpen, address, onDismiss }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { user } = useContext(AuthContext);
  const heading = "Archive BTC Address";
  const submitText = "Archive";
  const getUrl = user && `/user/${user.id}/address`;

  const archive = async (e, actions) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await gpib.secure.delete(`/address/${address.id}`);
      await mutate(getUrl);
      actions.onDismiss();
    } catch (e) {
      setSubmitError(e);
    }
    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} heading={heading}>
      {({ wrapCallback }) => (
        <>
          <ErrorMessage error={submitError} />
          <p>Are you sure you want to archive the following address?</p>
          <p>
            <b>{`${address?.label}: `}</b>
            {address?.address1}
          </p>
          <SubmitSpinnerButton
            block
            onClick={wrapCallback(archive)}
            submitText={submitText}
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </Modal>
  );
};

export default AddressArchiveModal;
