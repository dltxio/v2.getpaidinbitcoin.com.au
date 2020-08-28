import React, { useContext, useState } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { AuthContext } from "../../Auth";
import gpib from "../../../apis/gpib";
import Modal from "../../Modal";
import Loader from "../../Loader";
import ErrorMessage from "../../ErrorMessage";
import SubmitButtonSpinner from "../SubmitSpinnerButton";

const AddressModalAdd = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const location = useLocation();
  const history = useHistory();
  const heading = "Archive BTC Address";
  const submitText = "Archive";
  const getUrl = user && `/user/${user.id}/address`;

  const { data: addresses, error, isValidating } = useSWR(getUrl, {
    revalidateOnFocus: false
  });

  const address = addresses && addresses.find((a) => a.id === Number(id));

  const archive = async (e, actions) => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      await gpib.secure.delete(`/address/${id}`);
      await mutate(getUrl);
      actions.onDismiss();
    } catch (e) {
      console.log(e);
      setSubmitError(e);
      setSubmitting(false);
    }
  };

  const onDismiss = () => {
    const base = location.pathname.replace(/(\/addresses)\/.*/, "$1");
    history.push(base);
  };

  return (
    <Modal isOpen onDismiss={onDismiss} heading={heading}>
      {({ wrapCallback }) => (
        <>
          <Loader loading={isValidating} diameter="2rem" />
          <ErrorMessage error={error || submitError} />
          {!error && (
            <>
              <p>{`Are you sure you want to archive the following address?`}</p>
              <p>
                <b>{`${address?.label}:  `}</b>
                {address?.address1}
              </p>
              <SubmitButtonSpinner
                block
                onClick={wrapCallback(archive)}
                submitText={submitText}
                isSubmitting={isSubmitting}
              />
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default AddressModalAdd;
