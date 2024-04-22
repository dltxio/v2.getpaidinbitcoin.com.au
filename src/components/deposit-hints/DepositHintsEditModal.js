import React, { useContext, useState } from "react";
import useSWR, { mutate } from "swr";
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
  depositReference: v.bankStatement,
  depositAmount: Number(v.depositAmount),
  bankStatement: v.bankStatement
});

const SUCCESS_MESSAGE =
  "Your employer has been emailed your updated pay instructions. " +
  "You will also be emailed a copy to keep as a personal record.";

const parseInitialValues = (fetchedData) =>
  ["id", "userID", "employerName", "depositAmount", "bankStatement"].reduce(
    (map, item) => {
      if (fetchedData[item]) map[item] = fetchedData[item];
      return map;
    },
    {}
  );

const DepositHintsEditModal = ({ isOpen, onDismiss }) => {
  const { user } = useContext(AuthContext);
  const { data, error, isValidating } = useSWR(
    `/user/${user.id}/deposithints`,
    { revalidateOnFocus: false }
  );
  const { data: userEnterprise } = useSWR(`/user/${user.id}/enterprise`);
  const [message, setMessage] = useState(null);
  const initialValues = parseInitialValues(data);

  const onSubmit = async (values, formActions, modalActions) => {
    try {
      const parsedValues = parseSubmitValues(values);
      const url = `/user/${user.id}/deposithints`;
      await gpib.secure.put(url, parsedValues);

      if (userEnterprise?.name) {
        await gpib.secure.post("/email/payinstructions", {
          UserID: user.id,
          ToEmail: userEnterprise.contactEmail
        });
      }

      if (values.sendInstructions.length > 0) {
        for (let instruction of values.sendInstructions) {
          if (instruction === "sendEmail")
            await gpib.secure.post("/email/payinstructions", {
              UserID: user.id,
              ToEmail: user.email
            });
          if (instruction === "sendSMS")
            await gpib.secure.post("/sms/payinstructions", { UserID: user.id });
        }
      }

      if (values.emailToAnotherAddress) {
        await gpib.secure.post("/email/payinstructions", {
          UserID: user.id,
          ToEmail: values.emailToAnotherAddress
        });
      }
      setMessage(SUCCESS_MESSAGE);
      mutate(url, (ac) => ({ ...ac, ...parsedValues }));
    } catch (e) {
      formActions.setErrors({ hidden: e });
    }
    formActions.setSubmitting(false);
  };

  const wrapOnDismiss = () => {
    setMessage(null);
    onDismiss();
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={wrapOnDismiss}
      heading="Update Payroll Information"
    >
      {({ onDismiss, wrapCallback }) => (
        <>
          <Loader loading={isValidating} diameter="2rem" />
          <ErrorMessage error={error} />
          <Alert variant="success" hidden={!message}>{message}</Alert>
          {!error ? (
            <DepositHintsForm
              onDismiss={onDismiss}
              onSubmit={wrapCallback(onSubmit)}
              initialValues={initialValues}
              submitText="Save"
              sourceFrom="EditModal"
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

export default DepositHintsEditModal;
