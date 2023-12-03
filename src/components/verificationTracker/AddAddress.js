import React, { useContext, useState } from "react";
import AddressForm from "components/addresses/AddressForm";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";
import useSWR, { mutate } from "swr";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { Button, Spinner, Alert } from "react-bootstrap";
import Card from "components/Card";

const AddAddress = ({ userEnterprise }) => {
  const { user, setVerified, setSkipKYC } = useContext(AuthContext);
  const { data: userHDAddress, error: fetchHDAddressError } = useSWR(
    `/user/${user.id}/address`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFetchingHDAddress = !userHDAddress && !fetchHDAddressError;
  
  const addAddress = async (v, actions) => {
    actions.setSubmitting(true);
    const parsedValues = { ...v, userID: user?.id, percent: Number(v.percent), addressOrXPubKey: v.address1 };
    console.log(parsedValues);

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
      if (!userEnterprise?.name) {
        setSkipKYC(true);
        setVerified(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Card>
        <div className="mb-3 d-flex justify-content-between">
          <Alert variant="primary" className="mb-4">
            Each pay cycle we automatically transfer bitcoin to your personal
            wallet! However, to make life easier, GPIB can create a custodial
            address on your behalf. You can add your own wallet later at any time and "sweep" the bitcoin.
          </Alert>
        </div>
        <div>
          <AddressForm
            onSubmit={addAddress}
            submitText="Add a Personal Address"
            omit={["percent", "type"]}
          />
          <ErrorMessage error={fetchHDAddressError} />
          <Loader loading={isFetchingHDAddress} />
        </div>
        <div>Or</div>
        <div>
          <Button onClick={generateHDAddress} disabled={isSubmitting} block>
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
            ) : userEnterprise?.name ? (
              "Generate an Address for me"
            ) : (
              "Use GPIB's Custodial Address" // todo make a constant
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddAddress;
