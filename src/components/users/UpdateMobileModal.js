import React, { useContext, useState } from "react";
import Modal from "components/Modal";
import useSWR from "swr";
import gpib from "apis/gpib";
import UpdateMobileForm from "./UpdateMobileForm";
import { Button, Alert } from "react-bootstrap";
import { AuthContext } from "components/auth/Auth";
import Loader from "components/Loader";
import ErrorMessage from "components/ErrorMessage";

const parseInitialValues = (fetchedData) =>
  ["Mobile"].reduce((map, item) => {
    if (fetchedData[item]) map[item] = fetchedData[item];
    return map;
  }, {});

const SUCCESS_MESSAGE = "Your mobile number has been updated successfully.";

const UpdateMobileModal = ({ isOpen, onDismiss }) => {
  const { user } = useContext(AuthContext);
  const { data, error, isValidating } = useSWR(
    `/user/${user.id}/deposithints`,
    { revalidateOnFocus: false }
  );
  const [message, setMessage] = useState();
  const initialValues = parseInitialValues(data);

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      await gpib.secure.post("/user/verifymobile", {
        code: parseInt(values.code)
      });
      setMessage(SUCCESS_MESSAGE);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      return true;
    } catch (e) {
      formActions.setErrors({ hidden: e });
      formActions.setSubmitting(false);
    }
  };

  const wrapOnDismiss = async () => {
    onDismiss();
    setMessage(null)
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={wrapOnDismiss}
      heading="Update your mobile"
    >
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
              initialValues={initialValues}
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
