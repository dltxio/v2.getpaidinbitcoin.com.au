import React from "react";
import Modal from "components/Modal";
import SubmitButtonSpinner from "components/forms/SubmitSpinnerButton";
import BillPaidCheckMark from "components/bills/BillPaidCheckmark";
import ErrorMessage from "components/ErrorMessage";

const PayWithCustodialWalletModal = ({
  isOpen,
  isPaid,
  onDismiss,
  custodialBtcBalance,
  billBtcAmount,
  onSubmit,
  isSubmitting
}) => {

  const enoughBalance = custodialBtcBalance >= billBtcAmount;

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      heading="Pay with your GPIB custodial Wallet"
      className="bills"
    >
      {!isPaid ? (
        <>
          <div className="content">
            <p>Your custodial wallet balance: {custodialBtcBalance} BTC</p>
            <p>This bill: {billBtcAmount} BTC</p>
            <ErrorMessage error={"Not enough Bitcoin in custodial wallet"} isHidden={enoughBalance}/>
          </div>
          <SubmitButtonSpinner
            submitText="Pay now"
            onClick={onSubmit}
            isSubmitting={isSubmitting}
            disabled={!enoughBalance}
          />
        </>
      ) : (
        <BillPaidCheckMark />
      )}
    </Modal>
  );
};

export default PayWithCustodialWalletModal;
