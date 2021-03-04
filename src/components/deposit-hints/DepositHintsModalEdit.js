import React, { useContext, useState } from "react";
import useSWR, { mutate } from "swr";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Alert } from "react-bootstrap";
import gpib from "apis/gpib";
import Modal from "components/Modal";
import DepositHintsForm from "components/deposit-hints/DepositHintsForm";
import { AuthContext } from "components/auth/Auth";
import Loader from "components/Loader";
import ErrorMessage from "components/ErrorMessage";

const parseSubmitValues = (v) => ({
  id: v.id,
  userID: v.userID,
  employerName: v.employerName,
  depositReference: v.depositReference,
  depositAmount: Number(v.depositAmount)
});

const parseInitialValues = (fetchedData) =>
  ["id", "userID", "employerName", "depositAmount"].reduce((map, item) => {
    if (fetchedData[item]) map[item] = fetchedData[item];
    return map;
  }, {});

const DepositHintsModalForm = (props) => {
  const { user } = useContext(AuthContext);
  const { data, error, isValidating } = useSWR(
    `/user/${user.id}/deposithints`,
    { revalidateOnFocus: false }
  );
  const { data: userEnterprise } = useSWR(`/user/${user.id}/enterprise`);
  const [message, setMessage] = useState();
  const initialValues = parseInitialValues(data);
  const location = useLocation();
  const history = useHistory();

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      const parsedValues = parseSubmitValues(values);
      const url = `/user/${user.id}/deposithints`;
      await gpib.secure.put(url, parsedValues);
      if (userEnterprise?.name) {
        await gpib.secure.get(
          `/email/payinstructions/${user.id}?email=${userEnterprise.contactEmail}`
        );
        setMessage(
          "Your employer has been emailed your updated pay instructions. You will also be emailed a copy to keep as a personal record. "
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
      mutate(url, (ac) => ({ ...ac, ...parsedValues }));
      modalActions.onDismiss();
    } catch (e) {
      console.log(e);
      formActions.setErrors({ hidden: e });
      formActions.setSubmitting(false);
    }
  };

  const onDismiss = () => {
    const path = location.pathname.replace(/\/payroll\/edit/g, "");
    history.push(path);
  };

  return (
    <Modal isOpen onDismiss={onDismiss} heading="Update Payroll Information">
      {({ onDismiss, wrapCallback }) => (
        <>
          <Loader loading={isValidating} diameter="2rem" />
          <ErrorMessage error={error} />
          {message && <Alert variant="success">{message}</Alert>}
          {!error ? (
            <DepositHintsForm
              onDismiss={onDismiss}
              onSubmit={wrapCallback(onSubmit)}
              initialValues={initialValues}
              submitText="Save"
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

export default DepositHintsModalForm;
