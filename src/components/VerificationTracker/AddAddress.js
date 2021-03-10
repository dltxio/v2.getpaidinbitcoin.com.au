import React, { useContext, useState } from "react";
import AddressForm from "components/addresses/AddressForm";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";
import useSWR, { mutate } from "swr";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { Button, Spinner } from "react-bootstrap";

const AddAddress = () => {
  const { user } = useContext(AuthContext);
  const { data: userHDAddress, error: fetchHDAddressError } = useSWR(
    `/user/${user.id}/address`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFetchingHDAddress = !userHDAddress && !fetchHDAddressError;
  const addAddress = async (v, actions) => {
    const parsedValues = { ...v, userID: user?.id, percent: Number(v.percent) };
    try {
      await gpib.secure.post(`/address`, parsedValues);
      actions.setSubmitting(false);
      await mutate(`/user/${user.id}/address`);
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: e });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const generateHDAddress = async () => {
    setIsSubmitting(true);
    try {
      await gpib.secure.post("/user/hdaddress");
      await mutate(`/user/${user.id}/address`);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <div className="mb-3 d-flex justify-content-between">
        <p>
          <b>Add a bitcoin address.</b>
        </p>
        <div className="d-flex align-items-end">
          <Button onClick={generateHDAddress} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner
                  animation="border"
                  variant="light"
                  size="sm"
                  className="mr-3"
                />
                Submitting
              </>
            ) : (
              "Generate HD Address"
            )}
          </Button>
        </div>
      </div>
      <div>
        <AddressForm
          onSubmit={addAddress}
          submitText="Add Address"
          omit={["percent"]}
        />
        <ErrorMessage error={fetchHDAddressError} />
        <Loader loading={isFetchingHDAddress} />
      </div>
    </div>
  );
};

export default AddAddress;
