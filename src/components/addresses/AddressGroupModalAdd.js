import React, { useContext } from "react";
import Modal from "components/Modal";
import AddressGroupForm from "./AddressGroupForm";
import { useLocation, useHistory } from "react-router-dom";
import useSWR, { mutate } from "swr";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";

const AddressGroupModalAdd = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const history = useHistory();
  const heading = "Add Group Address";
  const onDismiss = () => {
    const base = location.pathname.replace(/(\/addresses)\/.*/, "$1");
    history.push(base);
  };

  const { data: groupAddresses } = useSWR(`/address/group`);

  const onSubmit = async (values, formActions, modalActions) => {
    formActions.setSubmitting(true);
    try {
      values.userID = user?.id;
      values.percent = Number(values.percent);
      await gpib.secure.post(`/address/group`, values);
      await mutate(`/user/${user.id}/address`);
      modalActions.onDismiss();
      formActions.setSubmitting(false);
    } catch (error) {
      console.log(error);
      formActions.setErrors({ hidden: error });
      formActions.setSubmitting(false);
    }
  };
  return (
    <Modal isOpen onDismiss={onDismiss} heading={heading}>
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

export default AddressGroupModalAdd;
