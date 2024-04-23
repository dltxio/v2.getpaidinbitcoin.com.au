import React, { useContext, useState } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useNavigate, useLocation } from "react-router-dom";
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
import DepositHintsEditModal from "components/deposit-hints/DepositHintsEditModal";
import ReferralSendModal from "components/users/ReferralSendModal";
import UpdateMobileModal from "components/users/UpdateMobileModal";
import RemittanceEditModal from "components/users/RemittanceEditModal";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [syncingBankAccount, setSyncingBankAccount] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [settingsError, setSettingsError] = useState();
  const [selectedModal, setSelectedModal] = useState(null);
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

  const { data: referralRate, error: fetchReferralRate } =
    useSWR("/referral/rate");
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
    try {
      const url = `/settings/${user.id}`;
      mutate(url, (state) => ({ ...state, ...updates }), false);
      await gpib.secure.patch(url, updates);
      mutate(url);
    } catch (error) {
      setSettingsError(error.response.data);
    }
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

  const modal = {
    EDIT_DEPOSIT_HINT: 1,
    SEND_REFERRAL: 2,
    EDIT_ACCOUNT_INFO: 3,
    UPDATE_MOBILE: 4
  };

  const onEditPayrollClick = () => setSelectedModal(modal.EDIT_DEPOSIT_HINT);
  const onEditReferralClick = () => setSelectedModal(modal.SEND_REFERRAL);
  const onEditMobileClick = () => setSelectedModal(modal.UPDATE_MOBILE);
  const onEditAccountInfoClick = () => setSelectedModal(modal.EDIT_ACCOUNT_INFO);
  const onUpdatePasswordClick = () => {
    navigate("/auth/resetpassword");
  };

  const onModalDismiss = () => {
    setSelectedModal(null);
  };

  const referralColumns = [
    ["Referral Code", `${user.id}`],
    [
      "Referral Link",
      `${process.env.REACT_APP_URL}/register?referralCode=${user.id}`
    ],
    ["Referral Bonus Per Transaction", `$ ${referralRate?.fixedAmount}`]
  ];

  const onConnectXero = async () => {
    try {
      const url = await gpib.secure.get("/xero");
      if (url) {
        window.open(url.data, "_blank");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error);
    }
  };

  const syncBankAccount = async () => {
    setSyncingBankAccount(true);
    try {
      await gpib.secure.post("/xero/syncBankAccount");
    } catch (error) {
      console.error(error);
      setErrorMessage(error);
    }
    setSyncingBankAccount(false);
  };
  return (
    <>
      <Layout activeTab="profile">
        <div className="container py-5">
          <Card>
            <div className="d-flex justify-content-between">
              <h4>Profile Information</h4>
              <Button className="mb-3" onClick={onEditMobileClick}>
                <span className="mr-2">Update Mobile </span>
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
              <div className="text-end">
                <Button className="mb-1 ms-1" onClick={onEditPayrollClick}>
                  <span>Edit </span>
                  <ion-icon name="create-outline" />
                </Button>
                <Button className="mb-1 ms-1" onClick={onConnectXero}>
                  <span>Connect to Xero</span>
                </Button>
                <Button className="mb-1 ms-1" onClick={syncBankAccount}>
                  <span>Sync Bank Account</span>
                </Button>
              </div>
            </div>
            <ErrorMessage error={fetchDepositHintsError | errorMessage} />
            <Loader loading={isFetchingDepositHints | syncingBankAccount} />
            <LabelledTable columns={payrollColumns} />
          </Card>
          <Card>
            <div className="d-flex justify-content-between">
              <h4>Remittance Setting</h4>
              <Button className="mb-3" onClick={onEditAccountInfoClick}>
                <span className="mr-2">Edit </span>
                <ion-icon name="create-outline" />
              </Button>
            </div>
            <ErrorMessage error={fetchSettingsError} />
            <Loader loading={isFetchingAccountInfo} />
            <LabelledTable columns={accountInfoColumns} />
          </Card>
          <Card>
            <div className="d-flex justify-content-between">
              <h4>Referral Program</h4>
              <Button className="mb-3" onClick={onEditReferralClick}>
                <span className="mr-2">Send Email </span>
                <ion-icon name="create-outline" />
              </Button>
            </div>
            <ErrorMessage error={fetchDepositHintsError} />
            <Loader loading={isFetchingDepositHints} />
            <LabelledTable columns={referralColumns} />
          </Card>
          <Card>
            <h4 className="mb-3">Settings</h4>
            <ErrorMessage error={fetchSettingsError || settingsError} />
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

      <DepositHintsEditModal
        isOpen={selectedModal === modal.EDIT_DEPOSIT_HINT}
        onDismiss={onModalDismiss}
      />
      <ReferralSendModal
        isOpen={selectedModal === modal.SEND_REFERRAL}
        onDismiss={onModalDismiss}
      />
      <UpdateMobileModal
        isOpen={selectedModal === modal.UPDATE_MOBILE}
        onDismiss={onModalDismiss}
      />
      <RemittanceEditModal
        isOpen={selectedModal === modal.EDIT_ACCOUNT_INFO}
        onDismiss={onModalDismiss}
      />
    </>
  );
};

export default ProfilePage;
