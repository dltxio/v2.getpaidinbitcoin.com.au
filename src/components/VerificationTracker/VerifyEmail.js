import React, { useState } from "react";
import SubmitSpinnerButton from "../forms/SubmitSpinnerButton";
import ErrorMessage from "../ErrorMessage";
import gpib from "../../apis/gpib";

const VerifyEmail = () => {
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
      <p>
        <b>Verify your email to continue</b>
      </p>
      <ErrorMessage error={error} />
      <p>
        We have sent you a link to verify your email. If you do not see an email
        from us please check your spam folder.
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
  );
};

export default VerifyEmail;
