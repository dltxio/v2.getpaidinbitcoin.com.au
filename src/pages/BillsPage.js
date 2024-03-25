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

const BillsPage = () => {
  const { user } = useContext(AuthContext);
  // form
  const [showModal, setShowModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState("");
  const [payWithCustodialWallet, setPayWithCustodialWallet] = useState(false);
  const [billInstructions, setBillInstructions] = useState(
    "Fetching your unique payment address... (NOT IMPLEMENTED)"
  );
  const [billBtcAmount, setBillBtcAmount] = useState(0.0008888);
  const [errorMessage, setErrorMessage] = useState(null);
  const [billId, setBillId] = useState(null);

  const { data: bills, error: fetchBillsError } = useSWR(`/bills`);

  const pollingBillIdRef = useRef(billId);

  useEffect(() => {
    const pollBillStatus = async () => {
      try {
        pollingBillIdRef.current = billId;

        while (pollingBillIdRef.current) {
          // const response = await gpib.secure.get(`/bills/${billId}`);

          // if (response.data?.paid) {
          pollingBillIdRef.current = pollingBillIdRef.current + 1; // for mocking
          if (pollingBillIdRef.current === 10001) {
            // for mocking
            setIsPaid(true);
            setBillId(null);
            pollingBillIdRef.current = null;
          }
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (e) {
        setErrorMessage(e.message);
      }
    };

    pollBillStatus();
  }, [billId]);

  const onDismiss = async () => {
    setBillId(null);
    setShowModal(false);
    setIsPaid(false);
    setErrorMessage(null);
  };

  const onSubmit = async (values, actions) => {
    setShowModal(true);
    try {
      ////// uncomment this block to enable testing with API
      // const url = `/bills`;
      // const response = await gpib.secure.post(url, values);

      // const amount = Number.parseFloat(response.data.btc).toFixed(8);
      // setBillBtcAmount(amount);
      // if (showModal && !payWithGpibCustodialWallet) {
      //   setPaymentAddress(response.data.address);
      //   setBillInstructions(`Please send ${amount} BTC to ${response.data?.address}`);
      // }

      setBillId(9999); // for mocking
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
          <BillsHistoryTable data={bills} />
        </Card>

        <PayWithPersonalWalletModal
          isOpen={showModal && !payWithCustodialWallet}
          isPaid={isPaid}
          paymentAddress={paymentAddress}
          billInstructions={billInstructions}
          onDismiss={onDismiss}
          errorMessage={errorMessage}
        />
      </div>
    </Layout>
  );
};

export default BillsPage;
