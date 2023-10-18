import React, { useContext, useState } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

import { useHistory, useLocation } from "react-router-dom";
import { format as format$ } from "currency-formatter";
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
import "./Dashboard.scss";

import { Formik, Form } from "formik";
import Input from "components/forms/Input";
import Modal from "components/Modal";

const BillsPage = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const location = useLocation();

  const [errorMessage, setErrorMessage] = useState();
  const [showModal, setShowModal] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState();
  const [billDetails, setBillDetails] = useState();

  // const { data: depositHints, error: fetchDepositHintsError } = useSWR(
  //   `/user/${user.id}/deposithints`
  // );

  // const isFetchingDepositHints = !depositHints && !fetchDepositHintsError;

  // const { data: userDetails, error: fetchDetailsError } = useSWR(
  //   `/user/${user.id}`
  // );

  const { data: settings, error: fetchSettingsError } = useSWR(
    `/settings/${user.id}`
  );

  // const { data: accountInfo, error: fetchAccountInfoError } = useSWR(
  //   `/accountInfoes/user/${user.id}`
  // );

  const updateSettings = async (updates) => {
    const url = `/settings/${user.id}`;
    mutate(url, (state) => ({ ...state, ...updates }), false);
    await gpib.secure.patch(url, updates);
    mutate(url);
  };

  const onPayNowClick = (e) => {
    // call api and get invoice id
    const url = `/bills/`;
    // gpib.secure.post(url, {
    // };
  };

  const onSubmit = async (values, actions) => {
    try {
      setShowModal(true);
      // await login(values);
      // if (onLogin) onLogin(values);

      const url = `/bills/`;
      const response = await gpib.secure.post(url, values);

      setPaymentAddress(response.data.address);
      setBillDetails(response.data);

      console.log(response);
    } catch (e) {
      console.log(e);
      // actions.setErrors({
      //   password: "Unable to login. Please check your email or password."
      // });
      actions.setSubmitting(false);
    }
  };

  // const uploadPDF = async (e) => {

  // };

  const initialValues = {
    label: "",
    biller: "",
    ref: "",
    amount: ""
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
            // validate={validate}
            onSubmit={onSubmit}
            // enableReinitialize
          >
            <Form>
              <Input
                name="label"
                label="Label for your reference"
                placeholder="Rent, Power Bill, etc"
              />
              <Input name="billercode" label="Biller Code" />
              <Input name="reference" label="Ref" />
              <Input name="fiat" label="Amount" />
              <Button variant="primary" className="mt-3" type="submit">
                Pay now with Bitcoin
              </Button>

              <SubmitButtonSpinner
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
          <ErrorMessage error={fetchSettingsError} />
          <TransactionTable />
        </Card>

        <Modal isOpen={showModal}>
          {({ onDismiss, wrapCallback }) => (
            <>Send {billDetails?.btc} BTC here! {billDetails?.address}</>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default BillsPage;
