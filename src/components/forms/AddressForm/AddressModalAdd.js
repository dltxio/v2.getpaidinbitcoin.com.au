import React, { useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { mutate } from "swr";
import { AuthContext } from "../../Auth";
import gpib from "../../../apis/gpib";
import AddressForm from "./AddressForm";
import Modal from "../../Modal";

const AddressModalAdd = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const history = useHistory();
  const heading = "Add Address";
  const submitText = "Add Address";
  const getUrl = user && `/user/${user.id}/address`;

  const parseSubmitValues = (v) => {
    const values = { ...v, userID: user?.id, percent: Number(v.percent) };
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
    <Modal isOpen onDismiss={onDismiss} heading={heading} large>
      {({ onDismiss, wrapCallback }) => (
        <AddressForm
          onDismiss={onDismiss}
          onSubmit={wrapCallback(onSubmit)}
          initialValues={{ userID: user.id }}
          submitText={submitText}
        />
      )}
    </Modal>
  );
};

export default AddressModalAdd;
