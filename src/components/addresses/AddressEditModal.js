import React, { useContext } from "react";
import { mutate } from "swr";
import { AuthContext } from "components/auth/Auth";
import gpib from "apis/gpib";
import AddressForm from "./AddressForm";
import Modal from "components/Modal";

const AddressEditModal = ({
  address,
  isOpen,
  onDismiss,
  hasMultipleAddresses
}) => {
  const { user } = useContext(AuthContext);
  const heading = "Edit BTC Address";
  const submitText = "Save";
  const getUrl = user && `/user/${user.id}/address`;

  const parseSubmitValues = (values) => {
    return {
      userID: user?.id,
      percent: Number(values.percent),
      label: values.label
    };
  };

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      const parsedValues = parseSubmitValues(values);
      await gpib.secure.put(`/address/${address?.id}`, parsedValues);
      await mutate(getUrl);
      modalActions.onDismiss();
    } catch (e) {
      formActions.setErrors({ hidden: e });
    }
    formActions.setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} heading={heading}>
      {({ onDismiss, wrapCallback }) => (
        <AddressForm
          onDismiss={onDismiss}
          onSubmit={wrapCallback(onSubmit)}
          initialValues={address}
          submitText={submitText}
          disableList={{ percent: !hasMultipleAddresses, isCustodial: true }}
          omitList={["address1"]}
        />
      )}
    </Modal>
  );
};

export default AddressEditModal;
