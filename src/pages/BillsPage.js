import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "components/auth/Auth";
import useSWR from "swr";
import { Alert } from "react-bootstrap";
import { isNumeric } from "validator";
import Layout from "components/layout/Layout";
import Loader from "components/Loader";
import SubmitButtonSpinner from "components/forms/SubmitSpinnerButton";
import Card from "components/Card";
import TransactionTable from "components/transactions/TransactionTable";
import gpib from "apis/gpib";
import QRCode from "qrcode.react";
import "./BillsPage.scss";
import "./Dashboard.scss";
import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import Modal from "components/Modal";
import BillsHistoryTable from "components/bills/BillsHistoryTable";
import Checkmark from "components/Checkmark";
import ToggleButton from "components/forms/ToggleButton";

const validate = ({ billercode, reference, amount }) => {
  const errors = {};
  const reqMsg = "This field is required";
  if (!billercode) errors.billercode = reqMsg;
  if (!reference) errors.ref = reqMsg;
  if (!isNumeric(String(amount))) errors.amount = "Amount must be a number";
  return errors;
};

const BillsPage = () => {
  const { user } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState("");
  const [payWithGpibCustodialWallet, setPayWithGpibCustodialWallet] =
    useState(false);
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  // const [bill, setBill] = useState();
  const [billCopy, setBillCopy] = useState(
    "Fetching your unique payment address... (NOT IMPLEMENTED)"
  );
  const [userHasSentBtc, setUserHasSentBtc] = useState(false);
  const [custodialBtcBalance, setCustodialBtcBalance] = useState(null);
  const [custodialAddressMessage, setCustodialAddressMessage] = useState("");
  const [buttonText, setButtonText] = useState("I have sent Bitcoin");

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

  const FAKE_BTC_BILL = 0.00088;
  useEffect(() => {
    const fetchData = async () => {
      const addresses = await getUserAddresses();
      const custodialAddress = await getCustodialAddress(addresses);
      const btcBalances = await getUserAddressBalances();
      if (!custodialAddress || !btcBalances) {
        setCustodialAddressMessage("No active custodial wallet found.");
        return;
      }

      setCustodialBtcBalance(btcBalances[custodialAddress]);
    };
    fetchData();
  }, []);

  const { data: bills, error: fetchBillsError } = useSWR(`/bills`);

  // if (bill) {
  //   // TODO: check if bill is paid
  //   const { data: billx, error: fetchBillsErrorx } = useSWR(`/bills${bill.id}`);
  // }

  const handlePaymentComplete = async () => {
    // reset states
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowModal(false);
    await new Promise((resolve) => setTimeout(resolve, 200)); // wait for modal to close
    setIsLoading(false);
    setIsPaid(false);

    // personal wallet
    setButtonText("I have sent the payment");
    setUserHasSentBtc(false);
    // custodial wallet
    setIsProcessingPay(false);
  };

  const handlePay = async () => {
    setIsProcessingPay(true);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsPaid(true);

    await handlePaymentComplete();
  };

  const pollBillStatus = (id) => {
    const pollInterval = setInterval(async () => {
      const response = await gpib.secure.get(`/bills/${id}`);

      console.log(response.data);

      if (response.data?.paid) {
        setIsPaid(true);
        clearInterval(pollInterval); // Stop polling
      }
    }, 5000); // Adjust the interval as needed (e.g., every 5 seconds)
  };

  // const onPayNowClick = (e) => {
  //   // call api and get invoice id
  //   const url = `/bills/`;
  //   // gpib.secure.post(url, {
  //   // };
  // };

  const onDismiss = () => {
    // TODO DELETE OR CANCEL BILL from DB
    clearInterval(0);
  };

  const handleUserSentBtc = async () => {
    setUserHasSentBtc(true);

    try {
      //   ////// await login(values);
      //   ////// if (onLogin) onLogin(values);

      ////// uncomment this block to enable testing with test API&DB
      // const url = `/bills/`;
      // const response = await gpib.secure.post(url, values);
      // console.log(response);
      // const amount = Number.parseFloat(response.data.btc).toFixed(8);
      // setPaymentAddress(`${response.data.address}`);
      // setBillCopy(`Please send ${amount} BTC to ${response.data?.address}`);
      // // setBill(response.data);

      ////// A button "I have sent the payment", click will activate the polling below
      // pollBillStatus(response.data.id);

      // handle bill status coming back

      setButtonText("Checking BTC on-chain");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsPaid(true);
      await handlePaymentComplete();
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = async (values, formActions) => {
    setShowModal(true);
    setIsLoading(true);

    // console.log(e);
    // formActions.setErrors({ hidden: e });
    // formActions.setSubmitting(false);
  };

  // const uploadPDF = async (e) => {
  // };

  const initialValues = {
    label: "",
    biller: "",
    ref: "",
    amount: 0
  };

  const BillPaidCheckMark = () => (
    <div className="content">
      <Checkmark />
      <p>Your bill has been paid.</p>
    </div>
  );

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
                />
              </div>
              <SubmitButtonSpinner
                isSubmitting={isLoading}
                className="mt-3"
                submitText="Pay now with Bitcoin"
              />
            </Form>
          </Formik>
          {/* <ErrorMessage error={fetchDetailsError} /> */}

          {/* <Button
            variant="primary"
            className="mt-3"
            onClick={onPayNowClick}
          >
            Pay from your GPIB wallet
          </Button>
          <Button
            variant="primary"
            className="mt-3"
            // onClick={onUpdatePasswordClick}
          >
            Add to bill schedule
          </Button>
          <Button
            variant="primary"
            className="mt-3"
            // onClick={onUpdatePasswordClick}
          >
            Upload a PDF
          </Button> */}
        </Card>
        <Card>
          <div className="d-flex justify-content-between">
            <h4>Scheduled</h4>
          </div>
          {/* <ErrorMessage error={fetchDepositHintsError | errorMessage} /> */}
          <TransactionTable />
        </Card>

        <Card>
          <h4 className="mb-3">Payment History</h4>
          {/* <ErrorMessage error={fetchSettingsError} /> */}
          <BillsHistoryTable data={bills} />
        </Card>

        {/* Modal to pay from personal Wallet */}
        <Modal
          isOpen={showModal && !payWithGpibCustodialWallet}
          onDismiss={onDismiss}
          heading="Your payment address"
          className="bills"
        >
          {(onDismiss) => (
            <>
              {!isPaid ? (
                <>
                  <div className="content">
                    {" "}
                    {/* container to reserve a fixed space and avoid components shift due to children size change */}
                    <QRCode id="BillPaymentAddress" value={paymentAddress} />
                  </div>
                  <p>{billCopy}</p>
                  <SubmitButtonSpinner
                    submitText={buttonText}
                    onClick={handleUserSentBtc}
                    isSubmitting={userHasSentBtc && !isPaid}
                  />
                </>
              ) : (
                <BillPaidCheckMark />
              )}
            </>
          )}
        </Modal>

        {/* Modal to pay from GPIB Custodial Wallet */}
        <Modal
          isOpen={showModal && payWithGpibCustodialWallet}
          onDismiss={onDismiss}
          heading="Pay with your GPIB custodial Wallet"
          className="bills"
        >
          {({ onDismiss }) => (
            <>
              {!isPaid ? (
                <>
                  <div className="content">
                    <p>
                      Your custodial wallet balance: {custodialBtcBalance} BTC
                    </p>
                    <p>This bill: {FAKE_BTC_BILL} BTC</p>
                  </div>
                  <SubmitButtonSpinner
                    submitText="Pay now"
                    onClick={handlePay}
                    isSubmitting={isProcessingPay}
                  />
                </>
              ) : (
                <BillPaidCheckMark />
              )}
            </>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default BillsPage;
