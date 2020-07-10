import React, { useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import useSWR, { mutate } from "swr";
import { AuthContext } from "../../Auth";
import gpib from "../../../apis/gpib";
import AddressForm from "./AddressForm";
import Modal from "../../Modal";
import { history } from "../../Router";
import Loader from "../../Loader";
import ErrorMessage from "../../ErrorMessage";

const AddressModalForm = () => {
  let id = parseInt(useParams().id);
  const location = useLocation();
  const isEditForm = !!id;
  const heading = isEditForm ? "Edit Address" : "Add Address";
  const submitText = isEditForm ? "Save" : "Add Address";
  const method = isEditForm ? "put" : "post";
  const url = isEditForm ? `/address/${id}` : "/address";
  const { data, error, isValidating } = useSWR(id && url);
  const isLoading = id && isValidating;
  const { user } = useContext(AuthContext);

  const parseSubmitValues = (id, v) => {
    const values = { ...v, userID: user?.id, percent: Number(v.percent) };
    return values;
  };

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      const v = parseSubmitValues(id, values);
      await gpib.secure[method](url, v);
      // TODO: check replace function when editing address
      const add = (ads) => [...ads, { id: Math.random(), ...v, ...data }];
      const replace = (ads) => ads.map((t) => (t.id !== id ? t : v));
      mutate("/transfer", id ? replace : add);
      modalActions.onDismiss();
    } catch (e) {
      console.log(e);
      formActions.setErrors({ hidden: e });
      formActions.setSubmitting(false);
    }
  };

  const onDismiss = () => {
    const base = location.pathname.replace(/\/address\/.*/, "");
    history.push(base);
  };

  return (
    <Modal isOpen onDismiss={onDismiss} heading={heading} large>
      {({ onDismiss, wrapCallback }) => (
        <>
          <Loader loading={isLoading} diameter="2rem" />
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
              initialValues={data}
              submitText={submitText}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default AddressModalForm;
