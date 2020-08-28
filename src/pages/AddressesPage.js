import React, { useContext, useEffect } from "react";
import useSWR from "swr";
import { ButtonGroup, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Layout from "components/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { AuthContext } from "components/Auth";
import Card from "components/Card";
import AddressTable from "components/tables/AddressTable";
import IconButton from "components/IconButton";
import useSelectedRow from "hooks/useSelectedRow";
import "./Dashboard.scss";

const AddressesPage = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const getAddressesUrl = `/user/${user.id}/address`;
  const [selected, setSelected, selectRowConfig] = useSelectedRow(null);
  const { data: addresses, error: fetchAddressError } = useSWR(getAddressesUrl);
  const isFetchingAddresses = !addresses && !fetchAddressError;
  const hasMultipleAddresses = addresses?.length > 1;

  useEffect(() => {
    if (!addresses) return;
    const hasAddress = addresses.find((a) => a.id === selected);
    if (!hasAddress) setSelected(null);
  }, [addresses, selected, setSelected]);

  const alertText = hasMultipleAddresses
    ? `If you wish to change your bitcoin address you can swap your desired address to a new bitcoin address.`
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
      onClick: () => history.push(`/addresses/archive/${selected}`),
      disabled: !selected,
      hide: !hasMultipleAddresses
    }
  ];

  return (
    <Layout activeTab="Addresses">
      <div className="container py-5">
        <Card>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>BTC Addresses</h4>
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
      </div>
    </Layout>
  );
};

export default AddressesPage;
