import React, { useContext, useState } from "react";
import useSWR, { mutate } from "swr";
import { ButtonGroup, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Layout from "../components/Layout";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import { AuthContext } from "../components/Auth";
import Card from "../components/Card";
import AddressTable from "../components/tables/AddressTable";
import IconButton from "../components/IconButton";
import useSelectedRow from "../hooks/useSelectedRow";
import ConfirmModal from "../components/ConfirmModal";

import "./Dashboard.scss";
import gpib from "../apis/gpib";

const AddressesPage = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const getAddressesUrl = `/user/${user.id}/address`;
  const [selected, , selectRowConfig] = useSelectedRow(null);
  const { data: addresses, error: fetchAddressError } = useSWR(getAddressesUrl);
  const isFetchingAddresses = !addresses && !fetchAddressError;
  const hasMultipleAddresses = addresses?.length > 1;

  const alertText = hasMultipleAddresses
    ? `If you wish to change your bitcoin address you can swap your desired address to a new bitcoin address`
    : `Your payment can be sent up to two bitcoin addresses. For example,
        you may want to split your payment and send 50% to a cold storage
        wallet and 50% to a hot wallet.`;

  const actions = [
    {
      icon: "add",
      title: "Add",
      onClick: () => history.push("/addresses/add"),
      hide: hasMultipleAddresses
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
      onClick: () => history.push(`/addresses/swap/${selected}`),
      disabled: !selected
    },
    {
      icon: "archive-outline",
      title: "Archive",
      onClick: () => setConfirmModalOpen(true),
      disabled: !selected,
      hide: !hasMultipleAddresses
    }
  ];

  const archiveSelected = async () => {
    await gpib.secure.delete(`/address/${selected}`);
    await mutate(getAddressesUrl);
  };

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
          <Alert variant="secondary" className="mt-3">
            {alertText}
          </Alert>
          <AddressTable
            addresses={addresses}
            pagination={false}
            selectRow={selectRowConfig}
          />
        </Card>
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onDismiss={() => setConfirmModalOpen(false)}
          heading="Are you sure?"
          confirmText="Archive"
          onConfirm={archiveSelected}
        />
      </div>
    </Layout>
  );
};

export default AddressesPage;
