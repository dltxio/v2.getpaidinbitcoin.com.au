import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "components/auth/Auth";
import { Alert } from "react-bootstrap";
import useSWR from "swr";

import Layout from "components/layout/Layout";
import Card from "components/Card";
import TransactionTable from "components/transactions/TransactionTable";
import gpib from "apis/gpib";
import BillsHistoryTable from "components/bills/BillsHistoryTable";
import PayWithCustodialWalletModal from "components/bills/PayWithCustodialWalletModal";
import PayWithPersonalWalletModal from "components/bills/PayWithPersonalWalletModal";
import CreateBillForm from "components/bills/CreateBillForm";
import "./Dashboard.scss";

const BillsPage = () => {
  const { user } = useContext(AuthContext);
  // form
  const [showModal, setShowModal] = useState(false);
  const [hasCustodialAddress, setHasCustodialAddress] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState("");
  const [payWithCustodialWallet, setPayWithCustodialWallet] =
    useState(false);
  const [billInstructions, setBillInstructions] = useState(
    "Fetching your unique payment address... (NOT IMPLEMENTED)"
  );
  const [billBtcAmount, setBillBtcAmount] = useState(0.0008888);
  const [errorMessage, setErrorMessage] = useState(null);
  const [custodialBtcBalance, setCustodialBtcBalance] = useState(null);
  const [billId, setBillId] = useState(null);

  const { data: bills, error: fetchBillsError } = useSWR(`/bills`);

  const getUserAddresses = async () => {
    const getAddressesUrl = `/user/${user.id}/address`;
    const addresses = await gpib.secure.get(getAddressesUrl);
    return addresses.data || [];
  };
  const getUserAddressBalances = async () => {
    const getBalancesUrl = `/user/${user.id}/address/totals`;
    const balances = await gpib.secure.get(getBalancesUrl);
    return balances.data;
  };
  const getCustodialAddress = async (userAddresses) => {
    const result = userAddresses.filter((a) => a.isCustodial === true);
    if (result.length > 0) return result[0].address1;
    else return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const addresses = await getUserAddresses();
      const custodialAddress = await getCustodialAddress(addresses);
      const btcBalances = await getUserAddressBalances();
      if (!custodialAddress || !btcBalances) {
        return;
      }
      
      setHasCustodialAddress(true);
      setCustodialBtcBalance(btcBalances[custodialAddress]);
    };
    fetchData();
  }, []);

  const handleCustodialPay = async () => {
    try {
      // call api to process payment
      await new Promise((resolve) => setTimeout(resolve, 1500)); // for mocking
      setIsPaid(true);
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

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
            hasCustodialAddress={hasCustodialAddress}
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

        <PayWithCustodialWalletModal
          isOpen={showModal && payWithCustodialWallet}
          isPaid={isPaid}
          onDismiss={onDismiss}
          custodialBtcBalance={custodialBtcBalance}
          billBtcAmount={billBtcAmount}
          onSubmit={handleCustodialPay}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </Layout>
  );
};

export default BillsPage;
