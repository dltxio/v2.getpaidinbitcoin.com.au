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
  const { user } = useContext(AuthContext);

  const { data: depositHints, error: fetchDepositHintsError } = useSWR(
    `/user/${user.id}/deposithints`
  );

  const { data: userDetails, error: fetchDetailsError } = useSWR(
    `/User/details/${user.id}`
  );

  const isFetchingDepositHints = !depositHints && !fetchDepositHintsError;

  const isFetchingDetails = !userDetails && !fetchDetailsError;

  return (
    <Layout activeTab="profile">
      <div className="container-fluid py-4">
        <Card>Welcome {user.firstName}</Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
