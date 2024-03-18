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
  billInstructions,
  buttonText,
  onSubmit,
  isSubmitting
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
          <p>{billInstructions}</p>
          <SubmitButtonSpinner
            submitText={buttonText}
            onClick={onSubmit}
            isSubmitting={isSubmitting}
          />
        </>
      ) : (
        <BillPaidCheckMark />
      )}
    </Modal>
  );
};

export default PayWithPersonalWalletModal;
