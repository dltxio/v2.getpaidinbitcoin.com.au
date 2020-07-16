import React, { useState } from "react";
import SubmitSpinnerButton from "../forms/SubmitSpinnerButton";

const VerifyEmail = () => {
  const [hasResent, setResent] = useState(false);
  const [isSending, setSending] = useState(false);
  const onResendClick = () => {
    setSending(true);
    window.setTimeout(() => {
      setResent(true);
      setSending(false);
    }, 1000);
  };
  return (
    <div>
      <p>
        <b>Verify your email to continue.</b>
      </p>
      <p>
        We have sent you a link to verify your email. If you do not see an email
        from us please check your spam folder
      </p>
      <SubmitSpinnerButton
        isSubmitting={isSending}
        variant="light"
        submitText="Resend verification email"
        block={false}
        onClick={onResendClick}
        icon={hasResent && "checkmark-circle"}
      />
    </div>
  );
};

export default VerifyEmail;
