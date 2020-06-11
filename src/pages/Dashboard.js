import React from "react";
import Layout from "../components/Layout";
import useResource from "../hooks/useResource";
import TransactionTable from "../components/tables/TransactionTable";
import UserStats from "../components/UserStats";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";

const Dashboard = () => {
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

  return (
    <Layout>
      <div className="container-fluid py-4">
        <section style={{ position: "relative" }}>
          <h2>User Stats</h2>
          <ErrorMessage error={fetchStatsError} />
          <Loader loading={isFetchingStats} />
          <UserStats stats={userStats} />
        </section>
        <section style={{ position: "relative" }}>
          <h2>Transactions</h2>
          <ErrorMessage error={fetchTransferError || fetchDepositError} />
          <Loader loading={isFetchingTransfers || isFetchingDeposits} />
          <TransactionTable transfers={transfers} deposits={deposits} />
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
