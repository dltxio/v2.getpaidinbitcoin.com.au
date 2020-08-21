import React, { useContext } from "react";
import useSWR from "swr";
import Layout from "components/Layout";
import VerificationTracker from "components/VerificationTracker";
import TransactionTable from "components/tables/TransactionTable";
import AddressTableWithBalance from "components/tables/AddressTableWithBalance";
import AddressPie from "components/AddressPie";
import UserStats from "components/UserStats";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { AuthContext } from "components/Auth";
import PayInformationTable from "components/tables/PayInformationTable";
import Card from "components/Card";
import PayInformationActions from "components/PayInformationActions";
import "./Dashboard.scss";

const Dashboard = () => {
  const {
    user,
    isVerified,
    isVerifying,
    userStatus,
    fetchStatusError
  } = useContext(AuthContext);
  const { data: depositHints, error: fetchDepositHintsError } = useSWR(
    isVerified && `/user/${user.id}/deposithints`
  );
  const { data: userStats, error: fetchStatsError } = useSWR(
    isVerified && "/userstats"
  );
  const { data: addresses, error: fetchAddressError } = useSWR(
    isVerified && `/user/${user.id}/address`
  );
  const { data: bankDetails, error: fetchBankDetailsError } = useSWR(
    isVerified && `/user/${user.id}/bankdetails`
  );
  const { data: userDetails, error: fetchDetailsError } = useSWR(
    isVerified && `/user/${user.id}`
  );
  const { data: transactions, error: fetchTransactionsError } = useSWR(
    isVerified && `/transaction`
  );

  // const isFetchingStatus = !String(userStatus) && !fetchStatusError;
  const isFetchingDepositHints =
    isVerified && !depositHints && !fetchDepositHintsError;
  const isFetchingStats = isVerified && !userStats && !fetchStatsError;
  const isFetchingAddresses = isVerified && !addresses && !fetchAddressError;
  const isFetchingBankDetails =
    isVerified && !bankDetails && !fetchBankDetailsError;
  const isFetchingDetails = isVerified && !userDetails && !fetchDetailsError;
  const isFetchingTransactions =
    isVerified && !transactions && !fetchTransactionsError;

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
                <h4>Addresses</h4>
                <ErrorMessage error={fetchAddressError} />
                <Loader loading={isFetchingAddresses} />
                <AddressTableWithBalance
                  addresses={addresses}
                  pagination={false}
                />
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
                  <h4>Unique Bitcoin Pay Information</h4>
                  <p>
                    Please provide the following Unique Bitcoin Pay Information
                    to your employer for processing the part of your salary to
                    be paid in bitcoin.
                  </p>
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
                  <PayInformationTable
                    bankDetails={bankDetails}
                    depositHints={depositHints}
                    userDetails={userDetails}
                  />
                  <PayInformationActions />
                </Card>
              </section>
            )}
            <section style={{ position: "relative" }}>
              <Card>
                <h4>Transactions</h4>
                <ErrorMessage error={fetchTransactionsError} />
                <Loader loading={isFetchingTransactions} />
                <TransactionTable transactions={transactions} />
              </Card>
            </section>
          </section>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
