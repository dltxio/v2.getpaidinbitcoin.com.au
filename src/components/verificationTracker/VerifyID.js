import React, { useContext, useState } from "react";
import useSWR from "swr";
import { Alert, Button } from "react-bootstrap";
import Card from "components/Card";
import { AuthContext } from "components/auth/Auth";
import VerifyForm from "../auth/VerifyForm";

const statuses = {
  NOT_STARTED: 0,
  STARTED: 1,
  SUBMITTED: 2,
  VERIFIED: 3,
  REJECTED: 4,
  CANCELLED: 5
};

const statusAlerts = {
  [statuses.STARTED]: {
    children:
      "An SMS has been sent to your mobile number with instructions to proceed with your verification process."
  },
  [statuses.SUBMITTED]: {
    children:
      "Your verification information has been received and is currently being processed."
  },
  [statuses.VERIFIED]: {
    children: "Congratulations, your ID Verification is now complete.",
    variant: "success"
  },
  [statuses.REJECTED]: {
    children:
      "Your ID Verification has not been successful. Please contact customer support.",
    variant: "danger"
  },
  [statuses.CANCELLED]: {
    children: "ID Verification has been cancelled.",
    variant: "danger"
  }
};

const iv = {
  state: "QLD"
};

const VerifyID = ({ submitText, showSkip }) => {
  const { user, setVerified, setSkipKYC } = useContext(AuthContext);
  const { data: userAddress } = useSWR(`/user/${user.id}/address`);
  const [idVerificationStatus, setIdVerificationStatus] = useState();
  const alert = statusAlerts[idVerificationStatus];
  const showAlert = alert;

  const handleSkipKYC = () => {
    setSkipKYC(true);
    setVerified(true);
  };

  return (
    <div>
      <Card>
        <Alert variant="primary">
          As an AUSTRAC registered exchange provider of Australian Dollars into
          Bitcoin, we are required to complete a short ID Verification process
          before we can provide any exchange services. This verification is a
          one-time process and your details are not stored. Please have your
          documents ready.
        </Alert>
        {showAlert && (
          <Alert
            variant={alert.variant ? alert.variant : "primary"}
            {...alert}
          />
        )}
        <div className="mr-auto">
          <VerifyForm
            setIdVerificationStatus={setIdVerificationStatus}
            statuses={statuses}
            initialValues={iv}
            submitText={submitText}
          ></VerifyForm>

          {userAddress && userAddress[0].isCustodial && showSkip && (
            <Button onClick={handleSkipKYC}>
              Skip KYC and Create a GPIB Custodial Address
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VerifyID;
