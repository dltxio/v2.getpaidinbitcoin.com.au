import React, { useContext } from "react";
import { mutate } from "swr";
import { AuthContext } from "components/auth/Auth";
import gpib from "apis/gpib";
import AddressForm from "./AddressForm";
import Modal from "components/Modal";

const AddressAddModal = ({addresses, isOpen, onDismiss}) => {
  const { user } = useContext(AuthContext);
  const heading = "Add BTC Address";
  const submitText = "Add BTC Address";
  const getUrl = user && `/user/${user.id}/address`;

  const isFirstAddress = addresses && addresses.length === 0;
  const isFirstAddressCustodial =
    addresses && addresses.length === 1 && addresses[0].isCustodial;
  const initialValues = {
    userID: user.id,
    percent: isFirstAddress || isFirstAddressCustodial ? 100 : ""
  };

  const parseSubmitValues = (values) => {
    return {
      userID: user?.id,
      percent: Number(values.percent),
      label: values.label,
      addressorxpubkey: values.address1,
      type: values.isCustodial
    };
  };

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      const parsedValues = parseSubmitValues(values);
      const url = `/address`;
      await gpib.secure.post(url, parsedValues);
      const add = (ads) => [...ads, { id: Infinity, ...parsedValues }];
      mutate(getUrl, add);
      modalActions.onDismiss();
    } catch (e) {
      formActions.setErrors({ hidden: e });
    }
    formActions.setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} heading={heading}>
      {({ onDismiss, wrapCallback }) => (
        <>
            <AddressForm
              onDismiss={onDismiss}
              onSubmit={wrapCallback(onSubmit)}
              initialValues={initialValues}
              submitText={submitText}
            />
        </>
      )}
    </Modal>
  );
};

export default AddressAddModal;
