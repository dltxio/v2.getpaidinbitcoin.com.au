import React, { useContext } from "react";
import useSWR from "swr";
import { ButtonGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Layout from "../components/Layout";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import { AuthContext } from "../components/Auth";
import Card from "../components/Card";
import AddressTable from "../components/tables/AddressTable";
import IconButton from "../components/IconButton";
import useSelectedRow from "../hooks/useSelectedRow";

import "./Dashboard.scss";

const AddressesPage = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  const [selected, , selectRowConfig] = useSelectedRow(null);
  const { data: addresses, error: fetchAddressError } = useSWR(
    `/user/${user.id}/address`
  );

  const isFetchingAddresses = !addresses && !fetchAddressError;
  const hasMultipleAddresses = !(addresses?.length > 1);

  const actions = [
    {
      icon: "add",
      title: "Add",
      onClick: () => history.push("/addresses/add"),
      hide: !hasMultipleAddresses
    },
    {
      icon: "create-outline",
      title: "Edit",
      onClick: () => history.push(`/addresses/edit/${selected}`),
      disabled: !selected
    },
    {
      icon: "swap-horizontal-outline",
      title: "Swap",
      disabled: !selected
    },
    {
      icon: "archive-outline",
      title: "Archive",
      disabled: !selected,
      hide: hasMultipleAddresses
    }
  ];

  return (
    <Layout activeTab="Addresses">
      <div className="container py-5">
        <Card>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Addresses</h4>
            <ButtonGroup>
              {actions.map(({ hide, ...props }, i) =>
                hide ? null : <IconButton key={i} {...props} />
              )}
            </ButtonGroup>
          </div>
          <ErrorMessage error={fetchAddressError} />
          <Loader loading={isFetchingAddresses} />
          <AddressTable
            addresses={addresses}
            pagination={false}
            selectRow={selectRowConfig}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default AddressesPage;
