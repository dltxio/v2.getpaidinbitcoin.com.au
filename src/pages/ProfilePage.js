import React, { useContext } from "react";
// import useSWR from "swr";
import Layout from "../components/Layout";
// import ErrorMessage from "../components/ErrorMessage";
// import Loader from "../components/Loader";
import { AuthContext } from "../components/Auth";
import Card from "../components/Card";
import "./Dashboard.scss";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // const { data: depositHints, error: fetchDepositHintsError } = useSWR(
  //   `/user/${user.id}/deposithints`
  // );

  // const { data: userDetails, error: fetchDetailsError } = useSWR(
  //   `/User/details/${user.id}`
  // );

  // const isFetchingDepositHints = !depositHints && !fetchDepositHintsError;

  // const isFetchingDetails = !userDetails && !fetchDetailsError;

  return (
    <Layout activeTab="profile">
      <div className="container-fluid py-4">
        <Card>Welcome {user.firstName}</Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
