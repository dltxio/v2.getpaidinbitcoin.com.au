import React, { useContext } from "react";
import useSWR from "swr";
import { Button } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { format as format$ } from "currency-formatter";
import Layout from "components/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { AuthContext } from "components/Auth";
import Card from "components/Card";
import LabelledTable from "components/tables/LabelledTable";
import "./Dashboard.scss";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const location = useLocation();

  const { data: depositHints, error: fetchDepositHintsError } = useSWR(
    `/user/${user.id}/deposithints`
  );

  const isFetchingDepositHints = !depositHints && !fetchDepositHintsError;

  const payrollColumns = [
    ["Employer", depositHints?.employerName],
    ["Deposit Amount", format$(depositHints?.depositAmount, { code: "AUD" })]
  ];

  const onEditPayrollClick = (e) =>
    history.push(`${location.pathname}/payroll/edit`);

  return (
    <Layout activeTab="profile">
      <div className="container py-5">
        <Card>
          <div className="d-flex justify-content-between">
            <h2>Payroll</h2>

            <Button className="mb-3" onClick={onEditPayrollClick}>
              <span className="mr-2">Edit</span>
              <ion-icon name="create-outline" />
            </Button>
          </div>
          <ErrorMessage error={fetchDepositHintsError} />
          <Loader loading={isFetchingDepositHints} />
          <LabelledTable columns={payrollColumns} />
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
