import React from "react";
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
import IconButton from "../components/IconButton";
import AccountLine from "../components/AccountLine";
const Dashboard = () => {
  const { data: userStatus } = useSWR("/user/status");
  const { data: transfers, error: fetchTransferError } = useSWR("/transfer");
  const { data: deposits, error: fetchDepositError } = useSWR("/deposit");
  const { data: userStats, error: fetchStatsError } = useSWR("/userstats");
  const { data: addresses, error: fetchAddressError } = useSWR("/address");
  // TODO: Perhaps make a route for deposit hint so or consolidate fetches. This just feels weird.
  const { data: userDetails, error: fetchDetailsError } = useSWR("/user");
  // End TODO
  // TODO: Bank Account route using the bankID from the userDetails or get someone to do a join
  // const { data: bank, error: fetchBankError} = useSWR('')
  const bank = {
    bsb: 123456,
    number: 12345678,
    bankName: "Bob's Discount Bankary",
    name: "Davette"
  };
  const fetchBankError = false;
  // End TODO
  const isFetchingDeposits = !deposits && !fetchDepositError;
  const isFetchingTransfers = !transfers && !fetchTransferError;
  const isFetchingStats = !userStats && !fetchStatsError;
  const isFetchingAddresses = !addresses && !fetchAddressError;
  const isFetchingBank = !bank && !fetchBankError;
  const isFetchingDetails = !userDetails && !fetchDetailsError;

  return (
    <Layout>
      <Loader />
      <div className="dashboard container-fluid">
        <section className="head">
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
            <h2>Bank Account</h2>
            <ErrorMessage error={fetchDetailsError || fetchBankError} />
            <Loader loading={isFetchingDetails || isFetchingBank} />
            <AccountLine bankInfo={bank} details={userDetails} />
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
