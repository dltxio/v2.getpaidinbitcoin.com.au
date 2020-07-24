import React, { useContext } from "react";
import useSWR from "swr";
// import { Button } from "react-bootstrap";
// import { useHistory, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import { AuthContext } from "../components/Auth";
import Card from "../components/Card";
import AddressTable from "../components/tables/AddressTable";
import "./Dashboard.scss";

const AddressesPage = () => {
  const { user } = useContext(AuthContext);
  // const history = useHistory();
  // const location = useLocation();

  const { data: addresses, error: fetchAddressError } = useSWR(
    `/user/${user.id}/address`
  );

  const isFetchingAddresses = !addresses && !fetchAddressError;

  // const isFetchingDetails = !userDetails && !fetchDetailsError;

  return (
    <Layout activeTab="Addresses">
      <div className="container py-5">
        <Card>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4>Addresses</h4>
            {/* <IconButton
              title="Add an address"
              onClick={() => history.push("/address/add")}
              icon="add"
            /> */}
          </div>
          <ErrorMessage error={fetchAddressError} />
          <Loader loading={isFetchingAddresses} />
          <AddressTable addresses={addresses} pagination={false} />
        </Card>
      </div>
    </Layout>
  );
};

export default AddressesPage;
