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
import "./BillsPage.scss";
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
  const [errorMessage, setErrorMessage] = useState();
  const [custodialBtcBalance, setCustodialBtcBalance] = useState(null);

  const [pollingBillId, setPollingBillId] = useState(null);

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

  useEffect(() => {
    console.log("showModal", showModal);
    console.log("isPaid", isPaid);
  }, [isPaid]);

  const handleCustodialPay = async () => {
    try {
      // call api and process payment
      // throw new Error("Test error");
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsPaid(true);
    } catch (e) {
      console.log(e);
      setErrorMessage(e.message);
      onDismiss();
    }
  };

  const pollingBillIdRef = useRef(pollingBillId);

  useEffect(() => {
    const pollBillStatus = async () => {
      pollingBillIdRef.current = pollingBillId;

      while (pollingBillIdRef.current) {
        console.log("pollingBillId...", pollingBillIdRef.current);
        // mock Polling at the moment as the API is having an error
        // const response = await gpib.secure.get(`/bills/${id}`);
        // console.log(response.data);

        // console.log('polling...')
        // if (response.data?.paid) {
        pollingBillIdRef.current = pollingBillIdRef.current + 1;
        if (pollingBillIdRef.current === 10002) {
          setIsPaid(true);
          setPollingBillId(null);
          pollingBillIdRef.current = null;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    };

    pollBillStatus();
  }, [pollingBillId]);

  const onDismiss = async () => {
    setPollingBillId(null);
    setShowModal(false);
    setIsPaid(false);
  };

  const onSubmit = async (values, actions) => {
    setShowModal(true);
    try {
      ////// uncomment this block to enable testing with API
      // const url = `/bills`;
      // const response = await gpib.secure.post(url, values);
      // console.log(response);

      // const amount = Number.parseFloat(response.data.btc).toFixed(8);
      // setBillBtcAmount(amount);
      // if (showModal && !payWithGpibCustodialWallet) {
      //   setPaymentAddress(`${response.data.address}`);
      //   setBillInstructions(`Please send ${amount} BTC to ${response.data?.address}`);
      //   pollBillStatus(response.data.id);
      // }

      // Mock pollBillStatus
      setPollingBillId(9999);
    } catch (e) {
      console.log(e);
      onDismiss();
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
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
              {/* <ErrorMessage error={errorMessage} isHidden={!errorMessage} /> */}
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
        />

        <PayWithCustodialWalletModal
          isOpen={showModal && payWithGpibCustodialWallet}
          isPaid={isPaid}
          onDismiss={onDismiss}
          custodialBtcBalance={custodialBtcBalance}
          billBtcAmount={billBtcAmount}
          onSubmit={handleCustodialPay}
        />
      </div>
    </Layout>
  );
};

export default BillsPage;
