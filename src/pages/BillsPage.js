import React, { useEffect, useState, useRef } from "react";
import { Alert } from "react-bootstrap";
import Layout from "components/layout/Layout";
import Card from "components/Card";
import gpib from "apis/gpib";
import BillsHistoryTable from "components/bills/BillsHistoryTable";
import PayWithPersonalWalletModal from "components/bills/PayWithPersonalWalletModal";
import CreateBillForm from "components/bills/CreateBillForm";
import "./Dashboard.scss";

const BillsPage = () => {
  const DEFAULT_BILL_INSTRUCTION = (
    <p>Fetching your unique payment address...</p>
  );

  const [showModal, setShowModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState("");
  const [payWithCustodialWallet, setPayWithCustodialWallet] = useState(false);
  const pollingBillId = useRef(null);
  const [billInstruction, setBillInstruction] = useState(
    DEFAULT_BILL_INSTRUCTION
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const [billHistory, setBillHistory] = useState([]);
  const [billHistoryError, setBillHistoryError] = useState(null);
  const [isLoadingBillHistory, setIsLoadingBillHistory] = useState(true);

  useEffect(() => {
    gpib.secure
      .get("/bills")
      .then((response) => {
        const billsProcessed = response.data.map((bill) => {
          bill.btcPaid = bill.btcPaid ? bill.dueDate : "";
          delete bill.dueDate;
          delete bill.address;
          delete bill.reference;
          delete bill.btcReceived;
          delete bill.isPaid;
          delete bill.userID;
          return bill;
        });
        setBillHistory(billsProcessed);
      })
      .catch((e) => {
        setBillHistoryError(e.message);
      })
      .finally(() => setIsLoadingBillHistory(false));
  }, []);

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
        const response = await gpib.secure.get(
          `/bills/${pollingBillId.current}`
        );

        if (response.data?.btcPaid) {
          setIsPaid(true);
          pollingBillId.current = null;
        }
        // wait before polling again
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
            <h4>Pay a Bill with Bitcoin!</h4>
          </div>
          <Alert variant="secondary" className="mt-3">
            You can now pay our bills with Bitcoin. Simply enter the
            BPay Biller code and Reference number from your bill and we will pay
            it for you.
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
          <BillsHistoryTable data={billHistory} errorMessage={billHistoryError} isLoading={isLoadingBillHistory}/>
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
