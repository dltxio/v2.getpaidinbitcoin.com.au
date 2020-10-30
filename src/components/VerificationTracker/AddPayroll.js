import React, { useContext } from "react";
import { mutate } from "swr";
import DepositHintsForm from "components/deposit-hints/DepositHintsForm";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";

const AddPayroll = () => {
  const { user } = useContext(AuthContext);
  const updatePayroll = async (v, actions) => {
    const parsedValues = {
      employerName: v.employerName,
      depositAmount: Number(v.depositAmount)
    };
    try {
      await gpib.secure.put(`/user/${user?.id}/deposithints`, parsedValues);
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
      <div>
        <DepositHintsForm onSubmit={updatePayroll} />
      </div>
    </div>
  );
};

export default AddPayroll;
