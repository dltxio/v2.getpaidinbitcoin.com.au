import React, { useContext, useState } from "react";
import useSWR from "swr";
import { Alert, Button } from "react-bootstrap";
import { AuthContext } from "components/auth/Auth";
import ErrorMessage from "components/ErrorMessage";
import Verify from "../../utils/Verify";

const statuses = {
  NOT_STARTED: 0,
  STARTED: 1,
  SUBMITTED: 2,
  VERIFIED: 3,
  REJECTED: 4
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
    children: "Congratulations, your ID Verification is now complete."
  },
  [statuses.REJECTED]: {
    children:
      "Your ID Verification has failed. Please contact customer support.",
    variant: "danger"
  }
};

const VerifyID = () => {
  const { user, setVerified, setSkipKYC } = useContext(AuthContext);
  const { data: userDetails, error: fetchDetailsError } = useSWR(
    user && `/user/${user.id}`
  );
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
      <p>
        <b>ID Verification</b>
      </p>
      <ErrorMessage error={fetchDetailsError} />
      <Alert variant="primary">
        As an AUSTRAC registered exchange provider of Australian Dollars into
        Bitcoin, we are required to complete a short ID Verification process
        before we can provide any exchange services. This verification is a
        one-time process and your details are not stored. Please have your
        Drivers Licence or Passport ready.
      </Alert>
      {showAlert && <Alert variant="primary" {...alert} />}
      {userAddress && userAddress[0].isCustodial && (
        <div className="mt-2 d-flex">
          <div className="mr-auto p-2">
            <Verify setIdVerificationStatus={setIdVerificationStatus} statuses={statuses} />
          </div>
          <div className="p-2">
            <Button
              onClick={handleSkipKYC}
              style={{
                width: "200px",
                height: "50px",
                backgroundColor: "rgb(0, 69, 216)"
              }}
            >
              Skip KYC
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyID;
