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
import { AuthContext } from "components/auth/Auth";
import Card from "components/Card";
import Toggle from "components/forms/Toggle";
import LabelledTable from "components/LabelledTable";
import TransactionTable from "components/transactions/TransactionTable";
import gpib from "apis/gpib";
import "./Dashboard.scss";

import { Formik, Form } from "formik";
import Input from "components/forms/Input";

const BillsPage = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const location = useLocation();

  const [errorMessage, setErrorMessage] = useState();
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

  // const payrollColumns = [
  //   ["Employer", depositHints?.employerName],
  //   ["Deposit Amount", format$(depositHints?.depositAmount, { code: "AUD" })],
  //   [
  //     "Deposit Reference (Wage transfer description or staff number as it appears on your bank statement)",
  //     depositHints?.bankStatement
  //   ]
  // ];

  const updateSettings = async (updates) => {
    const url = `/settings/${user.id}`;
    mutate(url, (state) => ({ ...state, ...updates }), false);
    await gpib.secure.patch(url, updates);
    mutate(url);
  };

  // const onEditPayrollClick = (_e) =>
  //   history.push(`${location.pathname}/payroll/edit`);

  const onPayNowClick = (_e) => {
    // call api and get invoice id
    window.btcpay.showInvoice("XHjKLLBJBx7aE4LadjYtZY");
  };

  const uploadPDF = async (e) => {
  };

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
            You can now pay our bills instantly with Bitcoin. Simply enter the BPay Biller code and Reference number from your bill and we will pay it instantly.
          </Alert>
          <Formik
            initialValues={initialValues}
            // validate={validate}
            // onSubmit={onSubmit}
            // enableReinitialize
          >
            <Form>
              <Input name="label" label="Label" placeholder="Rent, Power Bill, etc"/>
              <Input name="biller" label="Biller Code" />
              <Input name="ref" label="Ref" />
              <Input name="amount" label="Amount" />
            </Form>
          </Formik>
          {/* <ErrorMessage error={fetchDetailsError} /> */}
          <Button
            variant="primary"
            className="mt-3"
            onClick={onPayNowClick}
          >
            Pay now with Bitcoin
          </Button>
          <Button
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
      </div>
    </Layout>
  );
};

export default BillsPage;
