import React, { useState } from "react";
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
  onSubmit
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const enoughBalance = custodialBtcBalance > billBtcAmount;

  const onSubmitWrapper = async () => {
    setIsProcessing(true);
    if (onSubmit) await onSubmit();
  }

  const onDismissWrapper = async () => {
    if (onDismiss) await onDismiss();
    setIsProcessing(false);
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismissWrapper}
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
            onClick={onSubmitWrapper}
            isSubmitting={isProcessing}
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
