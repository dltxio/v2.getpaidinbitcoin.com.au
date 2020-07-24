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
import { AuthContext } from "../components/Auth";
import IconButton from "../components/IconButton";
import BankDetailsTable from "../components/tables/BankDetailsTable";
import Card from "../components/Card";
import "./Dashboard.scss";

const Dashboard = () => {
  const {
    user,
    isVerified,
    isVerifying,
    userStatus,
    fetchStatusError
  } = useContext(AuthContext);
  const { data: transfers, error: fetchTransferError } = useSWR(
    isVerified && `/transfer`
  );
  const { data: deposits, error: fetchDepositError } = useSWR(
    isVerified && "/deposit"
  );
  const { data: depositHints, error: fetchDepositHintsError } = useSWR(
    isVerified && `/user/${user.id}/deposithints`
  );
  const { data: userStats, error: fetchStatsError } = useSWR(
    isVerified && "/userstats"
  );
  const { data: addresses, error: fetchAddressError } = useSWR(
    isVerified && "/address"
  );
  const { data: bankDetails, error: fetchBankDetailsError } = useSWR(
    isVerified && `/user/${user.id}/bankdetails`
  );
  const { data: userDetails, error: fetchDetailsError } = useSWR(
    isVerified && `/User/details/${user.id}`
  );

  // const isFetchingStatus = !String(userStatus) && !fetchStatusError;
  const isFetchingDepositHints =
    isVerified && !depositHints && !fetchDepositHintsError;
  const isFetchingDeposits = isVerified && !deposits && !fetchDepositError;
  const isFetchingTransfers = isVerified && !transfers && !fetchTransferError;
  const isFetchingStats = isVerified && !userStats && !fetchStatsError;
  const isFetchingAddresses = isVerified && !addresses && !fetchAddressError;
  const isFetchingBankDetails =
    isVerified && !bankDetails && !fetchBankDetailsError;
  const isFetchingDetails = isVerified && !userDetails && !fetchDetailsError;

  if (isVerifying) return <Loader loading />;

  return (
    <Layout>
      <div className="dashboard container-fluid py-4">
        <ErrorMessage error={fetchStatusError} />
        {!isVerified && !isVerifying && (
          <section className="head">
            <VerificationTracker status={userStatus} />
          </section>
        )}
        <section className="main row">
          <div className={isVerified ? "overlay" : "overlay active"} />
          <aside className="col-lg-5">
            <section>
              <Card>
                <h4>Stats</h4>
                <ErrorMessage error={fetchStatsError} />
                <Loader loading={isFetchingStats} />
                <UserStats stats={userStats} />
              </Card>
            </section>
            <Card>
              <section>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4>Addresses</h4>
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
              {isVerified && userStatus && (
                <section className="d-flex justify-content-center">
                  <Loader loading={isFetchingAddresses} />
                  <AddressPie addresses={addresses} />
                </section>
              )}
            </Card>
          </aside>
          <section className="content col-lg-7">
            {isVerified && (
              <section style={{ position: "relative" }}>
                <Card>
                  <h4>Bank Account</h4>
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
            <section style={{ position: "relative" }}>
              <Card>
                <h4>Transactions</h4>
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
