import React, { useContext } from "react";
import Modal from "components/Modal";
import AddressGroupForm from "./AddressGroupForm";
import { mutate } from "swr";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";

const AddressGroupModal = ({ isOpen, address, onDismiss }) => {
  const { user } = useContext(AuthContext);
  const heading = "Set Group Address";

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      await gpib.secure.put(`/address/group/${address.id}`, values);
      await mutate(`/user/${user.id}/address`);
      modalActions.onDismiss();
    } catch (error) {
      formActions.setErrors({ hidden: error });
    }
    formActions.setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} heading={heading}>
      {({ onDismiss, wrapCallback }) => (
        <AddressGroupForm
          onDismiss={onDismiss}
          onSubmit={wrapCallback(onSubmit)}
          initialValues={address}
        />
      )}
    </Modal>
  );
};

export default AddressGroupModal;
