import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "components/auth/Auth";
import { Alert } from "react-bootstrap";
import useSWR from "swr";

import Layout from "components/layout/Layout";
import Card from "components/Card";
import gpib from "apis/gpib";
import BillsHistoryTable from "components/bills/BillsHistoryTable";
import PayWithPersonalWalletModal from "components/bills/PayWithPersonalWalletModal";
import CreateBillForm from "components/bills/CreateBillForm";
import "./Dashboard.scss";
import ErrorMessage from "components/ErrorMessage";

const BillsPage = () => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState("");
  const [payWithCustodialWallet, setPayWithCustodialWallet] = useState(false);
  const DEFAULT_BILL_INSTRUCTION = (
    <p>Fetching your unique payment address...</p>
  );
  const [billInstruction, setBillInstruction] = useState(
    DEFAULT_BILL_INSTRUCTION
  );
  const [errorMessage, setErrorMessage] = useState(null);

  const { data: bills, error: fetchBillsError } = useSWR(`/bills`);
  let billsProcessed;
  if (bills) {
    bills.reverse();
    billsProcessed = bills.map((bill) => {
      bill.btcPaid = bill.btcPaid ? bill.dueDate : "";
      delete bill.dueDate;
      delete bill.address;
      delete bill.reference;
      delete bill.btcReceived;
      delete bill.isPaid;
      delete bill.userID;
      return bill;
    });
  }

  const pollingBillId = useRef(null);

  const insertElipseInMiddleAddress = (str) => {
    const length = str.length;
    const FIRST_LINE_LIMIT = 42;
    if (length <= FIRST_LINE_LIMIT) {
      return <>{str}</>;
    }
    return (
      <>
        {str.substring(0, FIRST_LINE_LIMIT)}
        <span style={{ userSelect: "none" }}>...</span>
        <wbr />
        {str.substring(FIRST_LINE_LIMIT)}
      </>
    );
  };

  const onDismiss = async () => {
    setShowModal(false);
    setIsPaid(false);
    pollingBillId.current = null;
    setPaymentAddress("");
    setBillInstruction(DEFAULT_BILL_INSTRUCTION);

    setErrorMessage(null);
  };

  const onSubmit = async (values, actions) => {
    setShowModal(true);
    try {
      const url = `/bills`;
      const response = await gpib.secure.post(url, values);

      const amount = Number.parseFloat(response.data?.btc).toFixed(8);
      setPaymentAddress(response.data?.address);
      setBillInstruction(
        <p className="bill-instruction">
          Please send {amount} BTC to{" "}
          {insertElipseInMiddleAddress(response.data?.address)}
        </p>
      );
      pollingBillId.current = response.data?.id;

      while (pollingBillId.current) {
        const response = await gpib.secure.get(`/bills/${pollingBillId.current}`);

        if (response.data?.btcPaid) {
          setIsPaid(true);
          pollingBillId.current = null;
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (e) {
      onDismiss();
      setErrorMessage(e.message);
    }
  };

  return (
    <Layout activeTab="bills">
      <div className="bills container py-5">
        <Card>
          <div className="d-flex justify-content-between">
            <h4>Pay a Bill Instantly</h4>
          </div>
          <Alert variant="secondary" className="mt-3">
            You can now pay our bills instantly with Bitcoin. Simply enter the
            BPay Biller code and Reference number from your bill and we will pay
            it instantly.
          </Alert>
          <CreateBillForm
            onSubmit={onSubmit}
            setPayWithCustodialWallet={setPayWithCustodialWallet}
            isSubmitting={showModal}
            errorMessage={errorMessage}
            hideError={!errorMessage || showModal}
          />
        </Card>

        <Card>
          <h4 className="mb-3">Payment History</h4>
          <BillsHistoryTable data={billsProcessed} />
          <ErrorMessage error={fetchBillsError} />
        </Card>

        <PayWithPersonalWalletModal
          isOpen={showModal && !payWithCustodialWallet}
          isPaid={isPaid}
          paymentAddress={paymentAddress}
          billInstruction={billInstruction}
          onDismiss={onDismiss}
          errorMessage={errorMessage}
        />
      </div>
    </Layout>
  );
};

export default BillsPage;
