import React from "react";
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
  const [userStatus, fetchStatusError] = useResource("/userstatus");

  const [transfers, fetchTransferError, isFetchingTransfers] = useResource(
    "/transfer",
    []
  );
  const [deposits, fetchDepositError, isFetchingDeposits] = useResource(
    "/deposit",
    []
  );

  const [userStats, fetchStatsError, isFetchingStats] = useResource(
    "/userstats",
    {}
  );

  const [addresses, fetchAddressError, isFetchingAddresses] = useResource(
    "/address",
    []
  );

  return (
    <Layout>
      <Loader />
      <div className="dashboard container">
        <section className="head container">
          <ErrorMessage error={fetchStatusError} />
          <VerificationTracker status={userStatus} />
        </section>
        <section className="main">
          <div className={userStatus === "5" ? "overlay" : "overlay active"} />
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
            <Loader loading={isFetchingTransfers || isFetchingDeposits} />
            <TransactionTable transfers={transfers} deposits={deposits} />
          </section>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
