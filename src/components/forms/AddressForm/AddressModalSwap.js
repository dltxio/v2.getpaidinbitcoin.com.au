import React, { useContext } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import useSWR, { mutate } from "swr";
import { AuthContext } from "../../Auth";
import gpib from "../../../apis/gpib";
import Modal from "../../Modal";
import AddressFormSwap from "./AddressFormSwap";
import Loader from "../../Loader";
import ErrorMessage from "../../ErrorMessage";

const AddressModalSwap = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const heading = "Swap BTC Address";
  const submitText = "Swap";
  const getUrl = user && `/user/${user.id}/address`;

  const { data: addresses, error, isValidating } = useSWR(getUrl, {
    revalidateOnFocus: false
  });

  const address = addresses && addresses.find((a) => String(a.id) === id);
  const initialValues = address && { label: address.label };

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
    <Modal isOpen onDismiss={onDismiss} heading={heading}>
      {({ onDismiss, wrapCallback }) => (
        <>
          <Loader loading={isValidating} diameter="2rem" />
          <ErrorMessage error={error} />
          {error ? (
            <Button
              onClick={onDismiss}
              variant="secondary"
              block
              children="Close"
            />
          ) : (
            <>
              <Alert variant="primary">
                Replace an existing address with a new address.
              </Alert>
              <AddressFormSwap
                onDismiss={onDismiss}
                onSubmit={wrapCallback(onSubmit)}
                submitText={submitText}
                initialValues={initialValues}
              />
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default AddressModalSwap;
