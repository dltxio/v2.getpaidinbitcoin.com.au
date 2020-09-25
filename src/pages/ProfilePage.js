import React, { useContext } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useHistory, useLocation } from "react-router-dom";
import { format as format$ } from "currency-formatter";
import Layout from "components/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { AuthContext } from "components/Auth";
import Card from "components/Card";
import Toggle from "components/forms/form-inputs/Toggle";
import LabelledTable from "components/tables/LabelledTable";
import "./Dashboard.scss";
import gpib from "apis/gpib";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const location = useLocation();

  const { data: depositHints, error: fetchDepositHintsError } = useSWR(
    `/user/${user.id}/deposithints`
  );
  const isFetchingDepositHints = !depositHints && !fetchDepositHintsError;

  const { data: userDetails, error: fetchDetailsError } = useSWR(
    `/user/${user.id}`
  );
  const isFetchingDetails = !userDetails && !fetchDetailsError;

  const { data: settings, error: fetchSettingsError } = useSWR(
    `/settings/${user.id}`
  );
  const isFetchingSettings = !settings && !fetchSettingsError;

  const fullName = [
    userDetails?.firstName,
    userDetails?.middleName,
    userDetails?.lastName
  ]
    .filter((n) => n)
    .join(" ");

  const mobile = parsePhoneNumberFromString(
    userDetails?.mobileNumber,
    "AU"
  ).format("INTERNATIONAL");

  const feesPerTransaction = userDetails?.fees;
  const profileColumns = [
    ["Name", fullName],
    ["Mobile", mobile],
    ["Email", userDetails?.email],
    ["Fees per transaction", format$(feesPerTransaction, { code: "AUD" })]
  ];

  const payrollColumns = [
    ["Employer", depositHints?.employerName],
    ["Deposit Amount", format$(depositHints?.depositAmount, { code: "AUD" })]
  ];
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
    ]
  ];

  const onEditPayrollClick = (e) =>
    history.push(`${location.pathname}/payroll/edit`);

  const onUpdatePasswordClick = (e) => {
    history.push("/auth/resetpassword");
  };

  return (
    <Layout activeTab="profile">
      <div className="container py-5">
        <Card>
          <h4>Profile Information</h4>
          <ErrorMessage error={fetchDetailsError} />
          <Loader loading={isFetchingDetails} />
          <LabelledTable columns={profileColumns} />
          <p style={{ fontSize: "95%" }}>
            <i>
              Please <Link to="/contactsupport">contact support</Link> if any
              information is incorrect or needs to be updated.
            </i>
          </p>
        </Card>
        <Card>
          <div className="d-flex justify-content-between">
            <h4>Payroll</h4>
            <Button className="mb-3" onClick={onEditPayrollClick}>
              <span className="mr-2">Edit</span>
              <ion-icon name="create-outline" />
            </Button>
          </div>
          <ErrorMessage error={fetchDepositHintsError} />
          <Loader loading={isFetchingDepositHints} />
          <LabelledTable columns={payrollColumns} />
        </Card>
        <Card>
          <h4 className="mb-3">Settings</h4>
          <ErrorMessage error={fetchSettingsError} />
          <Loader loading={isFetchingSettings} />
          <LabelledTable columns={settingsColumns} />
          <Button
            variant="primary"
            className="mt-3"
            onClick={onUpdatePasswordClick}
          >
            Reset Password
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
