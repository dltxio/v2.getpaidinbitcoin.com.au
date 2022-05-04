import React, { useContext } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useHistory, useLocation } from "react-router-dom";
import { format as format$ } from "currency-formatter";
import Layout from "components/layout/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { AuthContext } from "components/auth/Auth";
import Card from "components/Card";
import Toggle from "components/forms/Toggle";
import LabelledTable from "components/LabelledTable";
import gpib from "apis/gpib";
import "./Dashboard.scss";

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

  const { data: referralRate, error: fetchReferralRate } = useSWR(
    "/referral/rate"
  );
  const isFetchingSettings =
    !settings && !fetchSettingsError && !fetchReferralRate;

  const { data: accountInfo, error: fetchAccountInfoError } = useSWR(
    `/accountInfoes/user/${user.id}`
  );

  const isFetchingAccountInfo = !accountInfo && !fetchAccountInfoError;

  const fullName = [
    userDetails?.firstName,
    userDetails?.middleName,
    userDetails?.lastName
  ]
    .filter((n) => n)
    .join(" ");

  const mobile = userDetails?.mobileNumber
    ? parsePhoneNumberFromString(userDetails?.mobileNumber, "AU").format(
        "INTERNATIONAL"
      )
    : "";
  console.log(mobile, "Jasmin");

  const feesPerTransaction = userDetails?.fees;
  const profileColumns = [
    ["Name", fullName],
    ["Mobile", mobile],
    ["Email", userDetails?.email],
    ["Fees Per Transaction", format$(feesPerTransaction, { code: "AUD" })]
  ];

  const payrollColumns = [
    ["Employer", depositHints?.employerName],
    ["Deposit Amount", format$(depositHints?.depositAmount, { code: "AUD" })],
    [
      "Deposit Reference (Wage transfer description or staff number as it appears on your bank statement)",
      depositHints?.bankStatement
    ]
  ];

  const accountInfoColumns = [
    [
      "BTC Threshold (Keep Bitcoin Pay on GPIB Portal until they reach this value.)",
      format$(accountInfo?.btcThreshold, { code: "AUD" })
    ]
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
    ],
    [
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

  const onEditPayrollClick = (_e) =>
    history.push(`${location.pathname}/payroll/edit`);

  const onUpdatePasswordClick = (_e) => {
    history.push("/auth/resetpassword");
  };
  const onEditReferralClick = (_e) =>
    history.push(`${location.pathname}/referral/send`);

  const onEditMobileClick = (_e) =>
    history.push(`${location.pathname}/mobile/send`);

  const onEditAccountInfoClick = (_e) =>
    history.push(`${location.pathname}/accountInfo/edit`);

  const referralColumns = [
    ["Referral Code", `${user.id}`],
    [
      "Referral Link",
      `${process.env.REACT_APP_URL}/register?referralCode=${user.id}`
    ],
    ["Referral Bonus Per Transaction", `$ ${referralRate?.fixedAmount}`]
  ];
  return (
    <Layout activeTab="profile">
      <div className="container py-5">
        <Card>
          <div className="d-flex justify-content-between">
            <h4>Profile Information</h4>
            <Button className="mb-3" onClick={onEditMobileClick}>
              <span className="mr-2">Update Mobile</span>
              <ion-icon name="create-outline" />
            </Button>
          </div>
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
          <div className="d-flex justify-content-between">
            <h4>Remittance Setting</h4>
            <Button className="mb-3" onClick={onEditAccountInfoClick}>
              <span className="mr-2">Edit</span>
              <ion-icon name="create-outline" />
            </Button>
          </div>
          <ErrorMessage error={fetchAccountInfoError} />
          <Loader loading={isFetchingAccountInfo} />
          <LabelledTable columns={accountInfoColumns} />
        </Card>
        <Card>
          <div className="d-flex justify-content-between">
            <h4>Referral Program</h4>
            <Button className="mb-3" onClick={onEditReferralClick}>
              <span className="mr-2">Send Email</span>
              <ion-icon name="create-outline" />
            </Button>
          </div>
          <ErrorMessage error={fetchDepositHintsError} />
          <Loader loading={isFetchingDepositHints} />
          <LabelledTable columns={referralColumns} />
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
