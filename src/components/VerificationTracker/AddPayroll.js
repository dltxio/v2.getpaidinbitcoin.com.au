import React, { useContext, useMemo, useState } from "react";
import { mutate } from "swr";
import DepositHintsForm from "components/deposit-hints/DepositHintsForm";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";
import { Alert } from "react-bootstrap";

const AddPayroll = ({ userEnterprise }) => {
  const [message, setMessage] = useState();
  const initialValues = useMemo(
    () => ({ employerName: userEnterprise?.name }),
    [userEnterprise]
  );
  const { user } = useContext(AuthContext);
  const updatePayroll = async (v, actions) => {
    const parsedValues = {
      employerName: v.employerName,
      depositAmount: Number(v.depositAmount)
    };
    try {
      await gpib.secure.put(`/user/${user?.id}/deposithints`, parsedValues);
      if (userEnterprise) {
        await gpib.secure.get(
          `/email/payinstructions/${user.id}?email=${userEnterprise.contactEmail}`
        );
        setMessage(
          "Your company will be automatically emailed with the updated details, there is no action required from you "
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
      await mutate(`/user/${user.id}/deposithints`);
      actions.setSubmitting(false);
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
    }
  };
  return (
    <div>
      <p>
        <b>Add your payroll information.</b>
      </p>
      {message && <Alert variant="success">{message}</Alert>}
      <div>
        <DepositHintsForm
          onSubmit={updatePayroll}
          initialValues={initialValues}
        />
      </div>
    </div>
  );
};

export default AddPayroll;
