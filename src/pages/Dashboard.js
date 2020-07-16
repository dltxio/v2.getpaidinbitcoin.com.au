import React, { useContext } from "react";
import useSWR from "swr";
import { history } from "../components/Router";
import Layout from "../components/Layout";
import VerificationTracker from "../components/VerificationTracker";
import TransactionTable from "../components/tables/TransactionTable";
import AddressTable from "../components/tables/AddressTable";
import AddressPie from "../components/AddressPie";
import UserStats from "../components/UserStats";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import "./Dashboard.scss";
import { AuthContext } from "../components/Auth";
import IconButton from "../components/IconButton";
import BankDetailsTable from "../components/tables/BankDetailsTable";
<<<<<<< Updated upstream
=======
import "./Dashboard.scss";
import Card from "../components/Card";

>>>>>>> Stashed changes
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { data: userStatus } = useSWR("/user/status");
  const { data: transfers, error: fetchTransferError } = useSWR("/transfer");
  const { data: deposits, error: fetchDepositError } = useSWR("/deposit");
  const { data: depositHints, error: fetchDepositHintsError } = useSWR(
    `/user/${user.id}/deposithints`
  );
  const { data: userStats, error: fetchStatsError } = useSWR("/userstats");
  const { data: addresses, error: fetchAddressError } = useSWR("/address");
  const { data: bankDetails, error: fetchBankDetailsError } = useSWR(
    `/user/${user.id}/bankdetails`
  );
  const { data: userDetails, error: fetchDetailsError } = useSWR(
    `/User/details/${user.id}`
  );
  const isFetchingDepositHints = !depositHints && !fetchDepositHintsError;
  const isFetchingDeposits = !deposits && !fetchDepositError;
  const isFetchingTransfers = !transfers && !fetchTransferError;
  const isFetchingStats = !userStats && !fetchStatsError;
  const isFetchingAddresses = !addresses && !fetchAddressError;
  const isFetchingBankDetails = !bankDetails && !fetchBankDetailsError;
  const isFetchingDetails = !userDetails && !fetchDetailsError;

<<<<<<< Updated upstream
  return (
    <Layout>
      <Loader />
      <div className="dashboard container-fluid">
        <section className="head">
          <VerificationTracker status={userStatus} />
        </section>
=======
  const isFetchingStatus = !String(userStatus) && !fetchStatusError;
  const isFetchingDepositHints =
    isVerified && !depositHints && !fetchDepositHintsError;
  const isFetchingDeposits = isVerified && !deposits && !fetchDepositError;
  const isFetchingTransfers = isVerified && !transfers && !fetchTransferError;
  const isFetchingStats = isVerified && !userStats && !fetchStatsError;
  const isFetchingAddresses = isVerified && !addresses && !fetchAddressError;
  const isFetchingBankDetails =
    isVerified && !bankDetails && !fetchBankDetailsError;
  const isFetchingDetails = isVerified && !userDetails && !fetchDetailsError;

  const renderContent = () => {
    if (isFetchingStatus || fetchStatusError)
      return (
        <div>
          <ErrorMessage error={fetchStatusError} />
          <Loader loading={isFetchingStatus} />
        </div>
      );
    return (
      <div className="dashboard container-fluid py-4">
        {!isVerified && (
          <section className="head">
            <VerificationTracker status={userStatus} />
          </section>
        )}
>>>>>>> Stashed changes
        <section className="main">
          <div className={userStatus === 5 ? "overlay" : "overlay active"} />
          <aside>
            <section>
<<<<<<< Updated upstream
              <h2>User Stats</h2>
              <ErrorMessage error={fetchStatsError} />
              <Loader loading={isFetchingStats} />
              <UserStats stats={userStats} />
            </section>
            <section>
              <div className="d-flex justify-content-between align-items-center">
                <h2>Addresses</h2>
                <IconButton
                  title="Add an address"
                  onClick={() => history.push("/address/add")}
                  icon="add"
                />
              </div>
              <ErrorMessage error={fetchAddressError} />
              <Loader loading={isFetchingAddresses} />
              <AddressTable addresses={addresses} pagination={false} />
            </section>
            <section className="d-flex justify-content-center">
              <Loader loading={isFetchingAddresses} />
              <AddressPie addresses={addresses} />
            </section>
          </aside>
          <section className="content">
            <section style={{ position: "relative" }}>
              <h2>Bank Account</h2>
              <ErrorMessage
                error={
                  fetchDepositHintsError ||
                  fetchBankDetailsError ||
                  fetchDetailsError
                }
              />
              <Loader
                loading={
                  isFetchingDepositHints ||
                  isFetchingBankDetails ||
                  isFetchingDetails
                }
              />
              <BankDetailsTable
                bankDetails={bankDetails}
                depositHints={depositHints}
                userDetails={userDetails}
              />
            </section>
=======
              <Card>
                <h2>Stats</h2>
                <ErrorMessage error={fetchStatsError} />
                <Loader loading={isFetchingStats} />
                <UserStats stats={userStats} />
              </Card>
            </section>
            <Card>
              <section>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h2>Addresses</h2>
                  <IconButton
                    title="Add an address"
                    onClick={() => history.push("/address/add")}
                    icon="add"
                  />
                </div>
                <ErrorMessage error={fetchAddressError} />
                <Loader loading={isFetchingAddresses} />
                <AddressTable addresses={addresses} pagination={false} />
              </section>
              {isVerified && (
                <section className="d-flex justify-content-center">
                  <Loader loading={isFetchingAddresses} />
                  <AddressPie addresses={addresses} />
                </section>
              )}
            </Card>
          </aside>
          <section className="content">
            {isVerified && (
              <section style={{ position: "relative" }}>
                <Card>
                  <h2>Bank Account</h2>
                  <ErrorMessage
                    error={
                      fetchDepositHintsError ||
                      fetchBankDetailsError ||
                      fetchDetailsError
                    }
                  />
                  <Loader
                    loading={
                      isFetchingDepositHints ||
                      isFetchingBankDetails ||
                      isFetchingDetails
                    }
                  />
                  <BankDetailsTable
                    bankDetails={bankDetails}
                    depositHints={depositHints}
                    userDetails={userDetails}
                  />
                </Card>
              </section>
            )}
>>>>>>> Stashed changes
            <section style={{ position: "relative" }}>
              <Card>
                <h2>Transactions</h2>
                <ErrorMessage error={fetchTransferError || fetchDepositError} />
                <Loader loading={isFetchingDeposits || isFetchingTransfers} />
                <TransactionTable transfers={transfers} deposits={deposits} />
              </Card>
            </section>
          </section>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
