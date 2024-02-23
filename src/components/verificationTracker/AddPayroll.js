import React, { useContext, useMemo, useState } from "react";
import { mutate } from "swr";
import DepositHintsForm from "components/deposit-hints/DepositHintsForm";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";
import { Alert, Button } from "react-bootstrap";
import Card from "components/Card";

const AddPayroll = ({ userEnterprise }) => {
  const [message, setMessage] = useState();
  const initialValues = useMemo(
    () => ({ employerName: userEnterprise?.name }),
    [userEnterprise]
  );
  const { user } = useContext(AuthContext);
  const enterprise = userEnterprise?.name;
  const showSkip = false;

  const updatePayroll = async (v, actions) => {
    const parsedValues = {
      employerName: v.employerName,
      depositAmount: Number(v.depositAmount),
      bankStatement: v.bankStatement
    };
    try {
      await gpib.secure.put(`/user/${user?.id}/deposithints`, parsedValues);
      if (userEnterprise?.name) {
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
      <Card>
        <Alert variant="info">
          To make sure we can match your wages payments, please add the
          following payroll information.
        </Alert>
        {message && <Alert variant="success">{message}</Alert>}
        <div>
          <DepositHintsForm
            submitText="Continue"
            onSubmit={updatePayroll}
            initialValues={initialValues}
            enterprise={enterprise}
          />
          <br />
          <Button block hidden={!showSkip}>
            or Skip KYC and Create a GPIB Custodial Address
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddPayroll;
