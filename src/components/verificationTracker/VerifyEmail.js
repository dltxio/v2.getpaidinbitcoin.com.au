import React, { useState } from "react";
import SubmitSpinnerButton from "../forms/SubmitSpinnerButton";
import ErrorMessage from "../ErrorMessage";
import gpib from "../../apis/gpib";
import QRCode from "qrcode.react";

const VerifyEmail = ({ userDetails }) => {
  const [hasResent, setResent] = useState(false);
  const [isSending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const onResendClick = async () => {
    try {
      setError(null);
      setSending(true);
      await gpib.secure.get("/user/verifyemail");
      setResent(true);
      setSending(false);
    } catch (e) {
      setSending(false);
      setError(e);
    }
  };

  const idemUrl = `${process.env.REACT_APP_IDEM_URL}?firstName=${userDetails.firstName}&lastName=${userDetails.lastname}&email=${userDetails.email}&userId=${userDetails.userID}`;
  const useIdem = process.env.REACT_APP_IDEM_URL ? true : false;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <p>
            <b>Verify your email to continue</b>
          </p>
          <ErrorMessage error={error} />
          <p>
            We have sent you a link to verify your email. <br></br>
            If you do not see an email from us please check your spam folder.
          </p>
          <SubmitSpinnerButton
            isSubmitting={isSending}
            variant="primary"
            submitText="Resend verification email"
            block={false}
            onClick={onResendClick}
            icon={hasResent && !error && "checkmark-circle"}
          />
        </div>
        {useIdem && (
          <div>
            <p className="ml-3">
              <b>Use Idem App to Verfiy</b>
            </p>
            <div className="p-2">
              <QRCode value={idemUrl ? idemUrl : null} size="200" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
