import React, { useContext } from "react";
import useSWR, { mutate } from "swr";
import gpib from "apis/gpib";
import Modal from "components/Modal";
import RemittanceEditForm from "./RemittanceEditForm";
import { AuthContext } from "components/auth/Auth";
import Loader from "components/Loader";
import ErrorMessage from "components/ErrorMessage";

const RemittanceEditModal = ({isOpen, onDismiss}) => {
  const { user } = useContext(AuthContext);
  const {
    data: accountInfo,
    error: fetchAccountInfoError,
    isValidating
  } = useSWR(`/accountInfoes/user/${user.id}`, { revalidateOnFocus: false });

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      await gpib.secure.post(
        `/accountInfoes/user/${user.id}/${values.btcThreshold}`
      );
      mutate(`/accountInfoes/user/${user.id}`);
    } catch (error) {
      formActions.setErrors({ hidden: error });
    }
    formActions.setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} heading="Remittance Setting">
      {({ onDismiss, wrapCallback }) => (
        <>
          <Loader loading={isValidating} diameter="2rem" />
          <ErrorMessage error={fetchAccountInfoError} />
          <RemittanceEditForm
            initialValues={{ btcThreshold: accountInfo?.btcThreshold }}
            onDismiss={onDismiss}
            onSubmit={wrapCallback(onSubmit)}
            submitText="Submit"
          />
        </>
      )}
    </Modal>
  );
};

export default RemittanceEditModal;
