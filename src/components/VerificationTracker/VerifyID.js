import React, { useContext, useState } from "react";
import useSWR, { mutate } from "swr";
import { Alert, Button } from "react-bootstrap";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";
import RapidIDForm from "components/auth/RapidIDForm";
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
  const idVerificationStatus = userDetails?.idVerificationStatus;
  const mobile = userDetails?.mobileNumber;
  const isStarted = idVerificationStatus >= statuses.STARTED;
  const isRejected = idVerificationStatus === statuses.REJECTED;
  const submitText = `${isStarted ? "Resend" : "Send"} Verification SMS`;
  const alert = statusAlerts[idVerificationStatus];
  const initialValues = { mobile };
  const [resend, setResend] = useState(false);
  const showForm = !isRejected && (!isStarted || (isStarted && resend));
  const showRestart = idVerificationStatus === statuses.STARTED && !showForm;
  const showAlert = alert && !resend;

  const sendVerificationSMS = async (v, actions) => {
    const parsedValues = { ...v, yob: Number(v.yob) };
    try {
      await gpib.secure.post(`/rapidid/${user.id}`, parsedValues);
      await mutate(`/user/${user.id}`, (user) => ({
        ...user,
        idVerificationStatus: 1
      }));
      setResend(false);
      actions.setSubmitting(false);
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
    }
  };

  const onRestartClick = () => {
    setResend(true);
  };

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
        Drivers Licence or Passport ready for the SMS link.
      </Alert>
      {showAlert && <Alert variant="primary" {...alert} />}
      <div>
        <div style={{ display: showForm ? undefined : "none" }}>
          <RapidIDForm
            onSubmit={sendVerificationSMS}
            submitText={submitText}
            initialValues={initialValues}
          />
        </div>
        {showRestart && (
          <Button
            variant="link"
            onClick={onRestartClick}
            children="Did not receive an SMS? Retry"
          />
        )}
      </div>
      {userAddress && userAddress[0].isCustodial && (
        <div className="mt-2 d-flex flex-row-reverse">
          <Button variant="primary" block onClick={handleSkipKYC}>
            Skip KYC
          </Button>
        </div>
      )}
      <div>
        <Verify />
      </div>
    </div>
  );
};

export default VerifyID;
