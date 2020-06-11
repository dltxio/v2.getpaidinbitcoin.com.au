import React from 'react';
import Layout from '../components/Layout';
import useResource from '../hooks/useResource';
import TransactionTable from '../components/tables/TransactionTable';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [transfers, fetchTransferError, isFetchingTransfers] = useResource(
    '/transfer',
    []
  );
  const [deposits, fetchDepositError, isFetchingDeposits] = useResource(
    '/deposit',
    []
  );
  return (
    <Layout>
      <div className="container-fluid py-4">
        <section style={{ position: 'relative' }}>
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
