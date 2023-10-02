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
  
  const { data: depositHints, error: fetchDepositHintsError } = useSWR(
    `/user/${user.id}/deposithints`
  );

  const { data: settings, error: fetchSettingsError } = useSWR(
    `/settings/${user.id}`
  );

  const updateSettings = async (updates) => {
    const url = `/settings/${user.id}`;
    mutate(url, (state) => ({ ...state, ...updates }), false);
    await gpib.secure.patch(url, updates);
    mutate(url);
  };

  const settingsColumns = [
    [
      "Email Remittance on Transfer",
      <Toggle
        className="float-right"
        value={settings?.sendEmailOnTransfer}
        setValue={() =>
          updateSettings({
            sendEmailOnTransfer: !settings?.sendEmailOnTransfer
          })
        }
      />
    ],
    [
      "Receive PGP Signed Emails",
      <Toggle
        className="float-right"
        value={settings?.sendPGPEmails}
        setValue={() =>
          updateSettings({
            sendPGPEmails: !settings?.sendPGPEmails
          })
        }
      />
    ]
  ];

  if (user.idVerificationStatus === 3) {
    settingsColumns.push([
      "Allow Grouped Addresses",
      <Toggle
        className="float-right"
        value={settings?.allowGroupedAddresses}
        setValue={() =>
          updateSettings({
            allowGroupedAddresses: !settings?.allowGroupedAddresses
          })
        }
      />
    ]);
  }

  const onEditPayrollClick = (_e) =>
    history.push(`${location.pathname}/payroll/edit`);

  const onUpdatePasswordClick = (_e) => {
    window.btcpay.showInvoice("BJtXmXXULAdosXWp8KFsoD");
  };

  const uploadPDF = async (e) => {

  };

  return (
    <Layout activeTab="bills">
      <div className="container py-5">
        <Card>
          <div className="d-flex justify-content-between">
            <h4>Pay a Bill Instantly</h4>
          </div>
          <Alert variant="secondary" className="mt-3">
            You can now pay our bills instantly with Bitcoin. Simply enter the Biller code and Reference number from your bill and we will pay it instantly.
          </Alert>
          <Formik
            // initialValues={iv}
            // validate={validate}
            // onSubmit={onSubmit}
            enableReinitialize
          >
            <Form>
              <Input name="label" label="Label" placeholder="Rent, Power Bill, etc"/>
              <Input name="biller" label="Biller Code" />
              <Input name="ref" label="Ref" />
              <Input name="amount" label="Amount" />
            </Form>
          </Formik>
          <ErrorMessage error={fetchDetailsError} />
          <Button
            variant="primary"
            className="mt-3"
            onClick={onUpdatePasswordClick}
          >
            Pay now with Bitcoin
          </Button>
          <Button
            variant="primary"
            className="mt-3"
            onClick={onUpdatePasswordClick}
          >
            Pay from your GPIB wallet
          </Button>
          <Button
            variant="primary"
            className="mt-3"
            // onClick={onUpdatePasswordClick}
          >
            Add to reoccurring bills
          </Button>
          <Button
            variant="primary"
            className="mt-3"
            // onClick={onUpdatePasswordClick}
          >
            Upload a PDF
          </Button>
        </Card>
        <Card>
          <div className="d-flex justify-content-between">
            <h4>Reoccurring Bills Schedule</h4>
          </div>
          <ErrorMessage error={fetchDepositHintsError | errorMessage} />
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
