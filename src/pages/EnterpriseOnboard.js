import React from "react";
import EnterprisesForm from "../components/enterprise/EnterprisesForm";
import Layout from "components/layout/Layout";
import Card from "components/Card";

const EnterpriseOnboard = (params) => {
  return (
    <Layout navLinks={[]}>
      <div className="d-flex justify-content-center container py-5 align-items-center">
        <Card
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ flex: 1, maxWidth: "80rem", minHeight: "30rem" }}
        >
          <h3>Corporate onboarding </h3>
          <EnterprisesForm style={{ flex: undefined }} />
        </Card>
      </div>
    </Layout>
  );
};

export default EnterpriseOnboard;
