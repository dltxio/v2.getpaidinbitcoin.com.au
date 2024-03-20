import React, { useContext, useEffect, useState } from "react";
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

  const handlePaymentComplete = async (isPaid = true) => {
    if (isPaid) {
      setIsPaid(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    // reset states
    setShowModal(false);
    await new Promise((resolve) => setTimeout(resolve, 200)); // wait for modal to close
    setIsPaid(false);
  };

  const handleCustodialPay = async () => {
    // call api and process payment
    await new Promise((resolve) => setTimeout(resolve, 800));

    await handlePaymentComplete();
  };

  const pollBillStatus = (id) => {
    const pollInterval = setInterval(async () => {
      // mock Polling at the moment as the API is having an error
      // const response = await gpib.secure.get(`/bills/${id}`);
      // console.log(response.data);

      // if (response.data?.paid) {
      if (true) {
        clearInterval(pollInterval);
        await handlePaymentComplete();
      }
    }, 2000); // Adjust the interval as needed
  };

  const onDismiss = async () => {
    await handlePaymentComplete(false);
    // TODO DELETE OR CANCEL BILL via API
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
      pollBillStatus(9999);
    } catch (e) {
      console.log(e);
      await handlePaymentComplete(false);
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
                  // TODO: check if user has custodial wallet, add an according message
                  label={`Pay with GPIB custodial wallet ${custodialAddressMessage}`}
                  // {/** TODO disabled if no custodial wallet, different color */}
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
