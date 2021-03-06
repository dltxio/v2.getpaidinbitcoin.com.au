import React, { useContext, useState, useRef } from "react";
import useSWR from "swr";
import Layout from "components/layout/Layout";
import VerificationTracker from "components/VerificationTracker";
import TransactionTable from "components/transactions/TransactionTable";
import AddressTotals from "components/addresses/AddressTotals";
import AddressPercentBar from "components/addresses/AddressPercentBar";
import UserStats from "components/users/UserStats";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { AuthContext } from "components/auth/Auth";
import PayInformationTable from "components/pay-information/PayInformationTable";
import Card from "components/Card";
import PayInformationActions from "components/pay-information/PayInformationActions";
import "./Dashboard.scss";
import ReferralCreditTable from "components/referral/ReferralCreditTable";
import ReferralTransferTable from "components/referral/ReferralTransferTable";
import { CSVLink } from "react-csv";
import { Alert, Button } from "react-bootstrap";
import gpib from "../apis/gpib";

const Dashboard = () => {
  const { user, isVerified, hasVerified } = useContext(AuthContext);
  const [year, setYear] = useState(new Date().getFullYear());
  const [transactionsDownload, setTransactionsDowload] = useState([]);
  const [downloadError, setDownloadError] = useState({
    show: false,
    message: ""
  });

  const csvRef = useRef();
  const { data: referralCredits, error: fetchReferralCreditsError } = useSWR(
    "/referralCredits"
  );

  const {
    data: referralTransfers,
    error: fetchReferralTransfersError
  } = useSWR("/referralTransfer");

  const { data: depositHints, error: fetchDepositHintsError } = useSWR(
    `/user/${user.id}/deposithints`
  );

  const { data: userDetails, error: fetchDetailsError } = useSWR(
    `/user/${user.id}`
  );

  const { data: userEnterprise } = useSWR(`/user/${user.id}/enterprise`);
  const { data: userAddress } = useSWR(user && `/user/${user.id}/address`);

  // Only if verified
  const { data: bankDetails, error: fetchBankDetailsError } = useSWR(
    isVerified && `/user/${user.id}/bankdetails`
  );

  const { data: transactions, error: fetchTransactionsError } = useSWR(
    isVerified && `/transaction`
  );
  const { data: userStats, error: fetchStatsError } = useSWR(
    isVerified && "/stats/all"
  );

  const { data: addressTotals, error: fetchAddressTotalsError } = useSWR(
    isVerified && `/user/${user.id}/address/totals`
  );

  const { data: archivedAddresses, error: fetchArchivedAddressError } = useSWR(
    isVerified && `/user/${user.id}/address?deleted=true`
  );

  const { data: activeAddresses, error: fetchActiveAddressError } = useSWR(
    isVerified && `/user/${user.id}/address`
  );
  // Loading status
  const isFetchingDepositHints = !depositHints && !fetchDepositHintsError;
  const isFetchingStats = isVerified && !userStats && !fetchStatsError;
  const isFetchingActiveAddresses =
    isVerified && !activeAddresses && !fetchActiveAddressError;
  const isFetchingArchivedAddresses =
    isVerified && !archivedAddresses && !fetchArchivedAddressError;
  const isFetchingAddressTotals =
    isVerified && !addressTotals && !fetchAddressTotalsError;
  const isFetchingBankDetails =
    isVerified && !bankDetails && !fetchBankDetailsError;
  const isFetchingDetails = isVerified && !userDetails && !fetchDetailsError;
  const isFetchingTransactions =
    isVerified && !transactions && !fetchTransactionsError;
  const isFetchingReferralCredits =
    isVerified && !referralCredits && !fetchReferralCreditsError;
  const isFetchingReferralTransfers =
    isVerified && !referralTransfers && !fetchReferralTransfersError;

  const currentYear = new Date().getFullYear();

  const handleDownload = async () => {
    setDownloadError({ show: false, message: "" });
    try {
      if (year) {
        const filterTransactions = await gpib.secure.get(
          `/transaction/download/${year}`
        );
        if (filterTransactions.data.length > 0) {
          setTransactionsDowload(filterTransactions.data);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          csvRef.current.link.click();
        } else {
          setDownloadError({ show: true, message: "No transactions found" });
        }
      }
    } catch (error) {
      console.error(error);
      setDownloadError({ show: true, message: error.message });
    }
  };
  return (
    <Layout activeTab="Dashboard">
      <div className="dashboard container-fluid py-4">
        <Loader loading={!hasVerified} />
        <VerificationTracker
          userDetails={userDetails}
          depositHints={depositHints}
          userEnterprise={userEnterprise}
          userAddress={userAddress}
        />
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
              <h4>Active Addresses</h4>
              <ErrorMessage
                error={
                  fetchActiveAddressError ||
                  fetchArchivedAddressError ||
                  fetchAddressTotalsError
                }
              />
              <Loader
                loading={
                  isFetchingActiveAddresses ||
                  isFetchingAddressTotals ||
                  isFetchingArchivedAddresses
                }
              />
              <AddressPercentBar addresses={activeAddresses} className="my-5" />
              <h4>BTC Received</h4>
              <AddressTotals
                active={activeAddresses}
                archived={archivedAddresses}
                totals={addressTotals}
                className="py-3"
              />
            </Card>
            <section>
              <Card>
                <h4>Referral Credits</h4>
                <ErrorMessage error={fetchReferralCreditsError} />
                <Loader loading={isFetchingReferralCredits} />
                <ReferralCreditTable referralCredits={referralCredits} />
              </Card>
            </section>
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
                <div className="d-flex flex-row">
                  <div className="mr-auto p-2">
                    <h4>Transactions</h4>
                  </div>
                  <div className="p-2">
                    <select
                      className="form-control"
                      id="downloadYear"
                      onChange={(e) => {
                        setYear(e.target.value);
                      }}
                    >
                      <option>{currentYear}</option>
                      <option>{currentYear - 1}</option>
                      <option>{currentYear - 2}</option>
                    </select>
                  </div>
                  <div className="p-2">
                    <Button onClick={handleDownload}>Download CSV</Button>
                    <CSVLink
                      data={transactionsDownload}
                      filename={"User-transactions.csv"}
                      className="hidden"
                      target="_blank"
                      ref={csvRef}
                    />
                  </div>
                </div>
                {downloadError.show && (
                  <Alert variant="danger">{downloadError.message}</Alert>
                )}
                <ErrorMessage error={fetchTransactionsError} />
                <Loader loading={isFetchingTransactions} />
                <TransactionTable transactions={transactions} />
              </Card>
              <Card>
                <h4>Referral Transactions</h4>
                <ErrorMessage error={fetchReferralTransfersError} />
                <Loader loading={isFetchingReferralTransfers} />
                <ReferralTransferTable referralTransfers={referralTransfers} />
              </Card>
            </section>
          </section>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
