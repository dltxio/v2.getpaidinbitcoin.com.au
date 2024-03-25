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
  const [showModal, setShowModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState("");
  const [payWithCustodialWallet, setPayWithCustodialWallet] = useState(false);
  const [billInstructions, setBillInstructions] = useState(
    "Fetching your unique payment address..."
  );
  const [billBtcAmount, setBillBtcAmount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [billId, setBillId] = useState(null);

  const { data: bills, error: fetchBillsError } = useSWR(`/bills`);

  const pollingBillId = useRef(null);

  const onDismiss = async () => {
    setShowModal(false);
    setIsPaid(false);
    pollingBillId.current = null;
    setPaymentAddress("");
    setBillInstructions("");
    setBillBtcAmount(null);

    setErrorMessage(null);
  };

  const onSubmit = async (values, actions) => {
    setShowModal(true);
    try {
      const url = `/bills`;
      const response = await gpib.secure.post(url, values);

      const amount = Number.parseFloat(response.data?.btc).toFixed(8);
      setBillBtcAmount(amount);
      setPaymentAddress(response.data?.address);
      setBillInstructions(
        `Please send ${amount} BTC to ${response.data?.address}`
      );
      pollingBillId.current = response.data?.id;

      console.log("response", response);

      while (pollingBillId.current) {
        // const response = await gpib.secure.get(`/bills/${pollingBillId.current}`);
        // console.log("response", response, response.data.btcPaid);

        // if (response.data?.btcPaid) {
        //   setIsPaid(true);
        //   pollingBillId.current = null;
        // }
        await new Promise((resolve) => setTimeout(resolve, 5000));
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
