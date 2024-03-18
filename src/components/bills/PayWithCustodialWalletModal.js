import React from "react";
import Modal from "components/Modal";
import SubmitButtonSpinner from "components/forms/SubmitSpinnerButton";
import BillPaidCheckMark from "components/bills/BillPaidCheckmark";

const PayWithCustodialWalletModal = ({
  isOpen,
  isPaid,
  onDismiss,
  custodialBtcBalance,
  billBtcAmount,
  onSubmit,
  isSubmitting
}) => {
  return (
    <Modal
      isOpen={isOpen}
      heading="Pay with your GPIB custodial Wallet"
      className="bills"
      ondismiss={onDismiss}
    >
      {!isPaid ? (
        <>
          <div className="content">
            <p>Your custodial wallet balance: {custodialBtcBalance} BTC</p>
            <p>This bill: {billBtcAmount} BTC</p>
          </div>
          <SubmitButtonSpinner
            submitText="Pay now"
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

export default PayWithCustodialWalletModal;
