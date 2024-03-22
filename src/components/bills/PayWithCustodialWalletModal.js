import React, { useState } from "react";
import Modal from "components/Modal";
import SubmitButtonSpinner from "components/forms/SubmitSpinnerButton";
import BillPaidCheckMark from "components/bills/BillPaidCheckmark";
import ErrorMessage from "components/ErrorMessage";
import LabelledTable from "components/LabelledTable";
import "./PayModal.scss";

const PayWithCustodialWalletModal = ({
  isOpen,
  isPaid,
  onDismiss,
  custodialBtcBalance,
  billBtcAmount,
  onSubmit,
  errorMessage,
  setErrorMessage
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const enoughBalance = custodialBtcBalance > billBtcAmount;
  if (isOpen && !enoughBalance)
    setErrorMessage("Not enough Bitcoin in your custodial wallet");

  const onSubmitWrapper = async () => {
    setIsProcessing(true);
    if (onSubmit) await onSubmit();
  };

  const onDismissWrapper = async () => {
    if (onDismiss) await onDismiss();
    setIsProcessing(false);
  };

  const tableData = [
    ["Custodial Wallet Balance (BTC)", custodialBtcBalance],
    ["Bill Amount (BTC)", billBtcAmount]
  ];

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
            <LabelledTable columns={tableData} />
            <ErrorMessage error={errorMessage} isHidden={!errorMessage} />
          </div>
          <SubmitButtonSpinner
            submitText="Pay now"
            onClick={onSubmitWrapper}
            isSubmitting={isProcessing}
            disabled={errorMessage}
          />
        </>
      ) : (
        <BillPaidCheckMark />
      )}
    </Modal>
  );
};

export default PayWithCustodialWalletModal;
