import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { Button } from "react-bootstrap";
import { AuthContext } from "components/auth/Auth";
import gpib from "apis/gpib";
import AddressForm from "./AddressForm";
import Modal from "components/Modal";
import Loader from "components/Loader";
import ErrorMessage from "components/ErrorMessage";

const AddressModalAdd = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const heading = "Add BTC Address";
  const submitText = "Add BTC Address";
  const getUrl = user && `/user/${user.id}/address`;

  const {
    data: addresses,
    error,
    isValidating
  } = useSWR(getUrl, {
    revalidateOnFocus: false
  });

  const isFirstAddress = addresses && addresses.length === 0;
  const isCustodialAddress =
    addresses && addresses.length === 1 && addresses[0].isCustodial;
  const initialValues = {
    userID: user.id,
    percent: isFirstAddress || isCustodialAddress ? 100 : ""
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
      console.log(e);
      formActions.setErrors({ hidden: e });
      formActions.setSubmitting(false);
    }
  };

  const onDismiss = () => {
    const base = location.pathname.replace(/(\/addresses)\/.*/, "$1");
    navigate(base);
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
            <AddressForm
              onDismiss={onDismiss}
              onSubmit={wrapCallback(onSubmit)}
              initialValues={initialValues}
              submitText={submitText}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default AddressModalAdd;
