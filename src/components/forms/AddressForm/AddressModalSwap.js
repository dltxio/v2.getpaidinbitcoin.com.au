import React, { useContext } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { mutate } from "swr";
import { AuthContext } from "../../Auth";
import gpib from "../../../apis/gpib";
import Modal from "../../Modal";
import AddressFormSwap from "./AddressFormSwap";

const AddressModalSwap = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const heading = "Swap Address";
  const submitText = "Update";
  const getUrl = user && `/user/${user.id}/address`;

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      await gpib.secure.post(`/address/${id}/swap`, values);
      await mutate(getUrl);
      modalActions.onDismiss();
    } catch (e) {
      console.log(e);
      formActions.setErrors({ hidden: e });
      formActions.setSubmitting(false);
    }
  };

  const onDismiss = () => {
    const base = location.pathname.replace(/(\/addresses)\/.*/, "$1");
    history.push(base);
  };

  return (
    <Modal isOpen onDismiss={onDismiss} heading={heading} large>
      {({ onDismiss, wrapCallback }) => (
        <>
          <Alert variant="primary">
            Replace an existing address with a new address.
          </Alert>
          <AddressFormSwap
            onDismiss={onDismiss}
            onSubmit={wrapCallback(onSubmit)}
            submitText={submitText}
          />
        </>
      )}
    </Modal>
  );
};

export default AddressModalSwap;
