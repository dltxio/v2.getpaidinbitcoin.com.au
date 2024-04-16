import React, { useState } from "react";
import Modal from "components/Modal";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import BillPaidCheckMark from "components/bills/BillPaidCheckmark";
import ErrorMessage from "components/ErrorMessage";
import QRCode from "qrcode.react";
import "./PayModal.scss";

const PayWithPersonalWalletModal = ({
  isOpen,
  isPaid,
  onDismiss,
  paymentAddress,
  billInstruction,
  onSubmit,
  errorMessage
}) => {
  const [submitText, setSubmitText] = useState("I have sent Bitcoin");
  const [userClickedSentBtc, setUserClickedSentBtc] = useState(false);

  const onDismissWrapper = async () => {
    if (onDismiss) await onDismiss();
    setSubmitText("I have sent Bitcoin");
    setUserClickedSentBtc(false);
  };

  const onSubmitWrapper = async () => {
    setSubmitText("Confirming your transaction...");
    setUserClickedSentBtc(true);
    if (onSubmit) await onSubmit();
  };

  const heading = isPaid ? "Payment received" : "Your payment address";

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismissWrapper}
      heading={heading}
      className="bills"
    >
      {!isPaid ? (
        <>
          <div className="content">
            {errorMessage ? (
              <ErrorMessage error={errorMessage} />
            ) : (
              <>
                <QRCode id="bitcoin-address-qrcode" value={paymentAddress} />
                <p className="bill-instructions">{billInstruction}</p>
              </>
            )}
          </div>
          <SubmitSpinnerButton
            submitText={submitText}
            onClick={onSubmitWrapper}
            isSubmitting={userClickedSentBtc && !isPaid}
            disabled={errorMessage}
          />
        </>
      ) : (
        <BillPaidCheckMark />
      )}
    </Modal>
  );
};

export default PayWithPersonalWalletModal;
