import React, { useContext, useState } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

import { useHistory, useLocation } from "react-router-dom";
import { isNumeric, isDecimal } from "validator";
import Layout from "components/layout/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import SubmitButtonSpinner from "components/forms/SubmitSpinnerButton";
import { AuthContext } from "components/auth/Auth";
import Card from "components/Card";
import Toggle from "components/forms/Toggle";
import LabelledTable from "components/LabelledTable";
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

const validate = ({ billercode, reference, amount }) => {
  const errors = {};
  const reqMsg = "This field is required";
  if (!billercode) errors.billercode = reqMsg;
  if (!reference) errors.ref = reqMsg;
  if (!isNumeric(String(amount))) errors.amount = "Amount must be a number";
  return errors;
};

const BillsPage = () => {
  // const { user } = useContext(AuthContext);

  // const history = useHistory();
  // const location = useLocation();

  const [errorMessage, setErrorMessage] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isPaid, setPaid] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState("bitcoin://");

  // const [bill, setBill] = useState();

  const [billCopy, setBillCopy] = useState(
    "Fetching your unique payment address ..."
  );

  const { data: bills, error: fetchBillsError } = useSWR(`/bills`);

  // if (bill) {
  //   // TODO: check if bill is paid
  //   const { data: billx, error: fetchBillsErrorx } = useSWR(`/bills${bill.id}`);
  // }

  const pollBillStatus = (id) => {
    const pollInterval = setInterval(async () => {
      const response = await gpib.secure.get(`/bills/${id}`);

      console.log(response.data);

      if (response.data?.paid) {
        setPaid(true);
        clearInterval(pollInterval);    // Stop polling
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
    // TODO DELETE OR CANCEL BILL
    clearInterval(0);
  };

  const onSubmit = async (values, actions) => {
    try {
      setShowModal(true);
      // await login(values);
      // if (onLogin) onLogin(values);

      const url = `/bills/`;
      const response = await gpib.secure.post(url, values);
      console.log(response);

      const amount = Number.parseFloat(response.data.btc).toFixed(8);

      setPaymentAddress(`${response.data.address}`);
      setBillCopy(`Please send ${amount} BTC to ${response.data?.address}`);
      // setBill(response.data);

      pollBillStatus(response.data.id);

      setLoading(false);
    } catch (e) {
      console.log(e);
      actions.setSubmitting(false);
    }
  };

  // const uploadPDF = async (e) => {

  // };

  const initialValues = {
    label: "",
    biller: "",
    ref: "",
    amount: 0
  };

  return (
    <Layout activeTab="bills">
      <div className="container py-5">
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

              <SubmitButtonSpinner
                isSubmitting={isLoading}
                variant="primary"
                className="mt-3"
                type="submit"
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

        <Modal
          isOpen={true}
          onDismiss={onDismiss}
          heading={"Your payment address"}
          large
        >
          {(onDismiss) => (
            <>
              <Loader loading={isLoading} diameter="2rem" />
              {!false ? (
                <>
                  <div className="bill-payment-address-container"> {/* container to reserve a fixed space and avoid components shift due to children size change */}
                    <QRCode id="BillPaymentAddress" value={paymentAddress} />
                  </div>
                  <p>{billCopy}</p>
                </>
              ) : (
                <>
                  <div className="bill-payment-address-container">
                    <Checkmark />
                  </div>
                  <p>Your bill has been paid</p>
                </>
              )}
            </>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default BillsPage;
