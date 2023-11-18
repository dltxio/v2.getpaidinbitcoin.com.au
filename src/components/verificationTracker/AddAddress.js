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
          <b>Add your bitcoin address</b>
        </div>
        <div>
          <AddressForm
            onSubmit={addAddress}
            submitText="Add on Personal Address"
            omit={["percent"]}
          />
          <ErrorMessage error={fetchHDAddressError} />
          <Loader loading={isFetchingHDAddress} />
        </div>
        <div>Or</div>
        <Alert variant="primary" className="mb-4">
          I want GPIB to create a custodial address for me. I understand that I
          won’t be able to access the BTC in this account until I add my own BTC
          address.
        </Alert>
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
              "Generate HD Address"
            ) : (
              "or Skip KYC and Create a GPIB Custodial Address"
            )}
          </Button>
        </div>
      </Card>
      <p></p>
      <Card>
        <div className="mb-3 d-flex justify-content-between">
          <b>Create an address for me</b>
        </div>
        <div>
          <Alert variant="primary" className="mb-4">
            I want GPIB to create a custodial address for me. I understand that
            I won’t be able to access the BTC in this account until I add my own
            BTC address.
          </Alert>
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
              "Generate HD Address"
            ) : (
              "Generate HD Address and Skip KYC"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddAddress;
