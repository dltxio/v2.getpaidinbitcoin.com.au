import React, { useContext } from "react";
import AddressForm from "../forms/AddressForm/AddressForm";
import gpib from "../../apis/gpib";
import { AuthContext } from "../Auth";
import { mutate } from "swr";
import { Alert } from "react-bootstrap";

const AddPayroll = () => {
  const { user } = useContext(AuthContext);

  const addAddress = async (v, actions) => {
    const parsedValues = { ...v, userID: user?.id, percent: Number(v.percent) };
    try {
      await gpib.secure.post(`/address`, parsedValues);
      await mutate("/user/status");
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
        <b>ID Verification</b>
      </p>
      <Alert variant="primary">
        As an AUSTRAC registered exchange provider of Australian Dollars into
        Bitcoin, we are required to complete a short ID Verification process
        before we can provide any exchange services. This verification is a
        one-time process and your details are not stored. Please have your
        Drivers Licence or Passport ready for the SMS link.
      </Alert>
      <div>
        <AddressForm onSubmit={addAddress} submitText="Add Address" />
      </div>
    </div>
  );
};

export default AddPayroll;
