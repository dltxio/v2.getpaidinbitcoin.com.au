import React from "react";
import Modal from "components/Modal";
import SubmitButtonSpinner from "components/forms/SubmitSpinnerButton";
import BillPaidCheckMark from "components/bills/BillPaidCheckmark";
import QRCode from "qrcode.react";

const PayWithPersonalWalletModal = ({
  isOpen,
  isPaid,
  onDismiss,
  paymentAddress,
  billCopy,
  buttonText,
  handleUserSentBtc,
  userHasSentBtc
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      heading="Your payment address"
      className="bills"
    >
      {!isPaid ? (
        <>
          <div className="content">
            <QRCode id="BillPaymentAddress" value={paymentAddress} />
          </div>
          <p>{billCopy}</p>
          <SubmitButtonSpinner
            submitText={buttonText}
            onClick={handleUserSentBtc}
            isSubmitting={userHasSentBtc && !isPaid}
          />
        </>
      ) : (
        <BillPaidCheckMark />
      )}
    </Modal>
  );
};

export default PayWithPersonalWalletModal;
