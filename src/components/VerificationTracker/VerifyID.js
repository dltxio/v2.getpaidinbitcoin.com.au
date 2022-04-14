import React, { useContext, useState } from "react";
import useSWR from "swr";
import { Alert, Button } from "react-bootstrap";
import { AuthContext } from "components/auth/Auth";
import Verify from "../../utils/Verify";

const statuses = {
  NOT_STARTED: 0,
  STARTED: 1,
  SUBMITTED: 2,
  VERIFIED: 3,
  REJECTED: 4,
  CANCELLED: 5
}; ///INTERESTINGGG

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
  },
  [statuses.CANCELLED]: {
    children: "ID Verification has been cancelled",
    varian: "danger"
  }
};

const VerifyID = () => {
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
      <p>
        <b>ID Verification</b>
      </p>
      <Alert variant="primary">
        As an AUSTRAC registered exchange provider of Australian Dollars into
        Bitcoin, we are required to complete a short ID Verification process
        before we can provide any exchange services. This verification is a
        one-time process and your details are not stored. Please have your
        documents ready.
      </Alert>
      {showAlert && <Alert variant={alert.varian ? alert.varian : "primary"} {...alert} />}
      <div className={userAddress[0].isCustodial ? "d-flex mt-2" : "mt-2"}>
        <div className="mr-auto">
          <Verify setIdVerificationStatus={setIdVerificationStatus} statuses={statuses} user={user} />
        </div>
        <div >
          {userAddress && userAddress[0].isCustodial && (
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
          )}
        </div>
      </div>

    </div>
  );
};

export default VerifyID;
