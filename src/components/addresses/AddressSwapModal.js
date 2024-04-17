import React, { useContext } from "react";
import { Alert } from "react-bootstrap";
import { mutate } from "swr";
import { AuthContext } from "components/auth/Auth";
import gpib from "apis/gpib";
import Modal from "components/Modal";
import AddressSwapForm from "./AddressSwapForm";

const AddressSwapModal = ({ address, isOpen, onDismiss }) => {
  const { user } = useContext(AuthContext);

  const heading = "Swap BTC Address";
  const submitText = "Swap";

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      await gpib.secure.post(`/address/${address.id}/swap`, values);
      await mutate(`/user/${user.id}/address`);
      modalActions.onDismiss();
    } catch (e) {
      formActions.setErrors({ hidden: e });
    } finally {
      formActions.setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} heading={heading}>
      {({ onDismiss, wrapCallback }) => (
        <>
          <Alert variant="primary">
            Replace an existing address with a new address.
          </Alert>
          <AddressSwapForm
            onSubmit={wrapCallback(onSubmit)}
            submitText={submitText}
          />
        </>
      )}
    </Modal>
  );
};

export default AddressSwapModal;
