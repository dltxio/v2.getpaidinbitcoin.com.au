import React, { useState } from "react";
import Modal from "components/Modal";
import SubmitButtonSpinner from "components/forms/SubmitSpinnerButton";
import BillPaidCheckMark from "components/bills/BillPaidCheckmark";
import QRCode from "qrcode.react";

const PayWithPersonalWalletModal = ({
  isOpen,
  isPaid,
  onDismiss,
  paymentAddress,
  billInstructions,
  onSubmit
}) => {
  const [submitText, setSubmitText] = useState("I have sent Bitcoin");
  const [userClickedSentBtc, setUserClickedSentBtc] = useState(false);

  const onDismissWrapper = async () => {
    if (onDismiss) await onDismiss();
    setSubmitText("I have sent Bitcoin");
    setUserClickedSentBtc(false);
  }

  const onSubmitWrapper = async () => {
    setSubmitText("Confirming your transaction...");
    setUserClickedSentBtc(true);
    if (onSubmit) await onSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismissWrapper}
      heading="Your payment address"
      className="bills"
    >
      {!isPaid ? (
        <>
          <div className="content">
            <QRCode id="BillPaymentAddress" value={paymentAddress} />
          </div>
          <p>{billInstructions}</p>
          <SubmitButtonSpinner
            submitText={submitText}
            onClick={onSubmitWrapper}
            isSubmitting={userClickedSentBtc && !isPaid}
          />
        </>
      ) : (
        <BillPaidCheckMark />
      )}
    </Modal>
  );
};

export default PayWithPersonalWalletModal;
