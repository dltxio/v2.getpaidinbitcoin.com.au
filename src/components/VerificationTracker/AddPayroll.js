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
  const enterprise = userEnterprise && userEnterprise.name;
  const updatePayroll = async (v, actions) => {
    const parsedValues = {
      employerName: v.employerName,
      depositAmount: Number(v.depositAmount)
    };
    try {
      await gpib.secure.put(`/user/${user?.id}/deposithints`, parsedValues);
      if (userEnterprise && userEnterprise?.name) {
        await gpib.secure.get(
          `/email/payinstructions/${user.id}?email=${userEnterprise.contactEmail}`
        );
        setMessage(
          "Your employer has been emailed your new pay instructions. You will also be emailed a copy to keep as a personal record. "
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
          enterprise={enterprise}
        />
      </div>
    </div>
  );
};

export default AddPayroll;
