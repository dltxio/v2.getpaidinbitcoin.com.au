import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "components/auth/Auth";
import { Formik, Form } from "formik";
import { Alert } from "react-bootstrap";
import { isNumeric } from "validator";
import useSWR from "swr";

import Layout from "components/layout/Layout";
import SubmitButtonSpinner from "components/forms/SubmitSpinnerButton";
import Card from "components/Card";
import TransactionTable from "components/transactions/TransactionTable";
import gpib from "apis/gpib";
import Input from "components/forms/Input";
import BillsHistoryTable from "components/bills/BillsHistoryTable";
import ToggleButton from "components/forms/ToggleButton";
import PayWithCustodialWalletModal from "components/bills/PayWithCustodialWalletModal";
import PayWithPersonalWalletModal from "components/bills/PayWithPersonalWalletModal";
import ErrorMessage from "components/ErrorMessage";
import "./Dashboard.scss";

const validate = ({ billercode, reference, fiat }) => {
  const errors = {};
  const reqMsg = "This field is required";
  if (!billercode) errors.billercode = reqMsg;
  if (!reference) errors.ref = reqMsg;
  if (!isNumeric(String(fiat))) errors.fiat = "Amount must be a number";
  return errors;
};

const BillsPage = () => {
  const { user } = useContext(AuthContext);
  // form
  const [showModal, setShowModal] = useState(false);
  const [custodialAddressMessage, setCustodialAddressMessage] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState("");
  const [payWithGpibCustodialWallet, setPayWithGpibCustodialWallet] =
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
        setCustodialAddressMessage("(No active custodial wallet found)");
        return;
      }

      setCustodialBtcBalance(btcBalances[custodialAddress]);
    };
    fetchData();
  }, []);

  const handleCustodialPay = async () => {
    try {
      // call api to process payment
      await new Promise((resolve) => setTimeout(resolve, 800)); // for mocking
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

  const initialValues = {
    label: "",
    billercode: "",
    reference: "",
    fiat: 0
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
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={onSubmit}
          >
            <Form>
              <Input
                name="label"
                label="Label for your reference"
                placeholder="Rent, Power Bill, etc"
              />
              <Input name="billercode" label="Biller Code" />
              <Input name="reference" label="Ref" />
              <Input name="fiat" label="AUD Amount" />
              <div>
                <ToggleButton
                  name="payWithGpibCustodialWallet"
                  label={`Pay with GPIB custodial wallet ${custodialAddressMessage}`}
                  onClick={(e) => {
                    setPayWithGpibCustodialWallet(e.target.checked);
                  }}
                  disabled={custodialBtcBalance === null}
                />
              </div>
              <SubmitButtonSpinner
                isSubmitting={showModal}
                className="mt-3"
                submitText="Pay now with Bitcoin"
              />
              <ErrorMessage error={errorMessage} isHidden={!errorMessage} />
            </Form>
          </Formik>
        </Card>

        <Card>
          <h4 className="mb-3">Payment History</h4>
          <BillsHistoryTable data={bills} />
        </Card>

        <PayWithPersonalWalletModal
          isOpen={showModal && !payWithGpibCustodialWallet}
          isPaid={isPaid}
          paymentAddress={paymentAddress}
          billInstructions={billInstructions}
          onDismiss={onDismiss}
          errorMessage={errorMessage}
        />

        <PayWithCustodialWalletModal
          isOpen={showModal && payWithGpibCustodialWallet}
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
