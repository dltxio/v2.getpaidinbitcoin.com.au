import React, { useState } from "react";
import SubmitSpinnerButton from "../forms/SubmitSpinnerButton";
import ErrorMessage from "../ErrorMessage";
import gpib from "../../apis/gpib";
import { Alert } from "react-bootstrap";

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

  return (
    <div>
      <Alert variant="info">
        Please verify your email address to continue.
      </Alert>
      <ErrorMessage error={error} />
      <p>
        We have sent you a link to verify your email. <br></br>
        If you do not see an email from us please check your spam folder.
      </p>

      <SubmitSpinnerButton
        isSubmitting={isSending}
        variant="primary"
        submitText="Resend verification email"
        block
        onClick={onResendClick}
        icon={hasResent && !error && "checkmark-circle"}
      />

      {/* {useIdem && (
          <Card>
            <div>
              <p className="ml-3">
                <b>Use Idem App to Verify</b>
              </p>
              <div className="p-2">
                <QRCode value={idemUrl ? idemUrl : null} size="200" />
              </div>
            </div>
          </Card>
        )} */}
    </div>
  );
};

export default VerifyEmail;
