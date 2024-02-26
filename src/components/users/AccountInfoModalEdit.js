import React, { useContext } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate, useLocation } from "react-router-dom";
import gpib from "apis/gpib";
import Modal from "components/Modal";
import AccountInfoForm from "./AccountInfoForm";
import { AuthContext } from "components/auth/Auth";
import Loader from "components/Loader";
import ErrorMessage from "components/ErrorMessage";

const AccountInfoModal = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const {
    data: accountInfo,
    error: fetchAccountInfoError,
    isValidating
  } = useSWR(`/accountInfoes/user/${user.id}`, { revalidateOnFocus: false });
  
  const onSubmit = async (values, formActions, modalActions) => {
    try {
      formActions.setSubmitting(true);
      await gpib.secure.post(
        `/accountInfoes/user/${user.id}/${values.btcThreshold}`
      );
      mutate(`/accountInfoes/user/${user.id}`);
      modalActions.onDismiss();
    } catch (error) {
      console.error(error);
      formActions.setErrors({ hidden: error });
      formActions.setSubmitting(false);
    }
  };

  const onDismiss = () => {
    const path = location.pathname.replace(/\/accountInfo\/edit/g, ""); //change url
    navigate(path);
  };

  return (
    <Modal isOpen onDismiss={onDismiss} heading="Account Setting">
      {({ onDismiss, wrapCallback }) => (
        <>
          <Loader loading={isValidating} diameter="2rem" />
          <ErrorMessage error={fetchAccountInfoError} />
          <AccountInfoForm
            initialValues={{ btcThreshold: accountInfo?.btcThreshold }}
            onDismiss={onDismiss}
            onSubmit={wrapCallback(onSubmit)}
            submitText="Submit"
            {...props}
          />
        </>
      )}
    </Modal>
  );
};

export default AccountInfoModal;
