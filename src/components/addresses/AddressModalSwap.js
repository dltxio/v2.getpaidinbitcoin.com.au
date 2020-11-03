import React, { useContext } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { mutate } from "swr";
import { AuthContext } from "components/auth/Auth";
import gpib from "apis/gpib";
import Modal from "components/Modal";
import AddressFormSwap from "./AddressFormSwap";
import axios from "axios";

const AddressModalSwap = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const heading = "Swap BTC Address";
  const submitText = "Swap";

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      const userIp = await axios
        .get("https://api.ipify.org")
        .catch((errors) => {
          console.log(errors);
        });

      await gpib.secure.post(`/address/${id}/swap`, values, {
        headers: {
          "X-Forwarded-For": userIp.data
        }
      });
      await mutate(`/user/${user.id}/address`);
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
    <Modal isOpen onDismiss={onDismiss} heading={heading}>
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
