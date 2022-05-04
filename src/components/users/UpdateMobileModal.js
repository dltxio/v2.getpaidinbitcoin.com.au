import React, { useContext, useState } from "react";
import Modal from "components/Modal";
import useSWR from "swr";
import { useHistory, useLocation } from "react-router-dom";
import gpib from "apis/gpib";
import UpdateMobileForm from "./UpdateMobileForm";
import { Button, Alert } from "react-bootstrap";
import { AuthContext } from "components/auth/Auth";
import Loader from "components/Loader";
import ErrorMessage from "components/ErrorMessage";


const UpdateMobileModal = (props) => {
  const { user } = useContext(AuthContext);
  const { error, isValidating } = useSWR(
    `/user/${user.id}/deposithints`,
    { revalidateOnFocus: false }
  );
  const [message, setMessage] = useState();
  const history = useHistory();
  const location = useLocation();
  const onDismiss = () => {
    const path = location.pathname.replace(/\/mobile\/send/g, "");
    history.push(path);
  };

  const onSubmit = async (values, formActions, modalActions, actions) => {
    try {
      await gpib.secure.post("/user/verifymobile", {
        code: parseInt(values.code)
      });
      actions.setSubmitting(false);
      setMessage("Your mobile has been verified");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      modalActions.onDismiss();
    } catch (e) {
      console.error(e);
      formActions.setErrors({ hidden: e });
      formActions.setSubmitting(false);
    }
  };

  return (
    <Modal isOpen onDismiss={onDismiss} heading="Update your mobile">
      {({ wrapCallback }) => (
        <>
          <Loader loading={isValidating} diameter="2rem" />
          <ErrorMessage error={error} />
          {message && <Alert variant="success">{message}</Alert>}
          {!error ? (
            <UpdateMobileForm
              onDismiss={onDismiss}
              onSubmit={wrapCallback(onSubmit)}
              sourceFrom="EditModal"
              {...props}
            />
          ) : (
            <Button
              block
              variant="secondary"
              children="Cancel"
              onClick={onDismiss}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default UpdateMobileModal;
