import React, { useContext } from "react";
import { mutate } from "swr";
import AddressForm from "components/addresses/AddressForm";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";

const AddAddress = () => {
  const { user } = useContext(AuthContext);

  const addAddress = async (v, actions) => {
    const parsedValues = { ...v, userID: user?.id, percent: Number(v.percent) };
    try {
      await gpib.secure.post(`/address`, parsedValues);
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

export default AddAddress;
