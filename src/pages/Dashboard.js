import React from "react";
import useSWR from "swr";
import Layout from "../components/Layout";
import useResource from "../hooks/useResource";
import VerificationTracker from "../components/VerificationTracker";
import TransactionTable from "../components/tables/TransactionTable";
import AddressTable from "../components/tables/AddressTable";
import AddressPie from "../components/AddressPie";
import UserStats from "../components/UserStats";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import "./Dashboard.scss";

const Dashboard = () => {
  const [userStatus] = useResource("/user/status", -1);

  const { data: transfers, error: fetchTransferError } = useSWR("/transfer");
  const { data: deposits, error: fetchDepositError } = useSWR("/deposit");
  const { data: userStats, error: fetchStatsError } = useSWR("/userstats");
  const { data: addresses, error: fetchAddressError } = useSWR("/address");
  const isFetchingDeposits = !deposits && !fetchDepositError;
  const isFetchingTransfers = !transfers && !fetchTransferError;
  const isFetchingStats = !userStats && !fetchStatsError;
  const isFetchingAddresses = !addresses && !fetchAddressError;

  return (
    <Layout>
      <Loader />
      <div className="dashboard container">
        <section className="head container">
          <VerificationTracker status={userStatus} />
        </section>
        <section className="main">
          <div className={userStatus === 5 ? "overlay" : "overlay active"} />
          <aside>
            <section>
              <h2>User Stats</h2>
              <ErrorMessage error={fetchStatsError} />
              <Loader loading={isFetchingStats} />
              <UserStats stats={userStats} />
            </section>
            <section>
              <h2>Addresses</h2>
              <ErrorMessage error={fetchAddressError} />
              <Loader loading={isFetchingAddresses} />
              <AddressTable addresses={addresses} />
            </section>
            <section className="d-flex justify-content-center">
              <Loader loading={isFetchingAddresses} />
              <AddressPie addresses={addresses} />
            </section>
          </aside>
          <section className="content">
            <h2>Transactions</h2>
            <ErrorMessage error={fetchTransferError || fetchDepositError} />
            <Loader loading={isFetchingDeposits || isFetchingTransfers} />
            <TransactionTable transfers={transfers} deposits={deposits} />
          </section>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
