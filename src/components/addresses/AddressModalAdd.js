import React, { useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
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
  const history = useHistory();
  const heading = "Add BTC Address";
  const submitText = "Add BTC Address";
  const getUrl = user && `/user/${user.id}/address`;

  const { data: addresses, error, isValidating } = useSWR(getUrl, {
    revalidateOnFocus: false
  });

  const isFirstAddress = addresses && addresses.length === 0;
  const isCustodialAddress =
    addresses && addresses.length === 1 && addresses[0].isCustodial;
  const initialValues = {
    userID: user.id,
    percent: isFirstAddress || isCustodialAddress ? 100 : ""
  };

  // TODO: REVIEW OLD ADDRESS PARAMS.  MAYBE BE ABLE TO REMOVE SOME, BUT WILL NOT CAUSE ISSUES
  const parseSubmitValues = (v) => {
    const values = {
      ...v,
      userID: user?.id,
      percent: Number(v.percent),
      addressorxpubkey: v.address1,
      type: "non-custodial"
    };
    return values;
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
            <AddressForm
              onDismiss={onDismiss}
              onSubmit={wrapCallback(onSubmit)}
              initialValues={initialValues}
              submitText={submitText}
              // disablePercent={isCustodialAddress}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default AddressModalAdd;
