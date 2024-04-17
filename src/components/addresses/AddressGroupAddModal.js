import React, { useContext } from "react";
import Modal from "components/Modal";
import AddressGroupForm from "./AddressGroupForm";
import { mutate } from "swr";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";

const AddressGroupAddModal = ({groupAddresses, isOpen, onDismiss}) => {
  const { user } = useContext(AuthContext);
  const heading = "Add Group Address";

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      values.userID = user?.id;
      values.percent = Number(values.percent);
      await gpib.secure.post(`/address/group`, values);
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
          groupAddresses={groupAddresses}
        />
      )}
    </Modal>
  );
};

export default AddressGroupAddModal;
