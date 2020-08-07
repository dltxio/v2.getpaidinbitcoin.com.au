import React, { useContext } from "react";
import AddressForm from "../forms/AddressForm/AddressForm";
import gpib from "../../apis/gpib";
import { AuthContext } from "../Auth";
import { mutate } from "swr";

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
        <b>Add a bitcoin address.</b>
      </p>
      <div>
        <AddressForm
          onSubmit={addAddress}
          submitText="Add Address"
          omit={["percent"]}
        />
      </div>
    </div>
  );
};

export default AddPayroll;
