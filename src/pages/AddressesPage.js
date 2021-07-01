import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { ButtonGroup, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Layout from "components/layout/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { AuthContext } from "components/auth/Auth";
import Card from "components/Card";
import AddressTable from "components/addresses/AddressTable";
import IconButton from "components/IconButton";
import useSelectedRow from "hooks/useSelectedRow";
import "./Dashboard.scss";

const AddressesPage = () => {
  const { user, skipKYC } = useContext(AuthContext);
  const history = useHistory();
  const getAddressesUrl = `/user/${user.id}/address`;
  const [selected, , selectRowConfig] = useSelectedRow(null);
  const { data: addresses, error: fetchAddressError } = useSWR(getAddressesUrl);
  const isFetchingAddresses = !addresses && !fetchAddressError;
  const hasMultipleAddresses = addresses?.length > 1;
  const [trustWalletAddress, setTrustWalletAddress] = useState([]);
  const [noTrustWalletAddress, setNoTrustWalletAddress] = useState([]);

  useEffect(() => {
    const trustAddress = addresses?.filter(
      (i) => i.groupID && i.groupID.toLowerCase() !== "null"
    );
    setTrustWalletAddress(trustAddress);
    const noTrustAddress = addresses?.filter(
      (i) => i.groupID?.toLowerCase() === "null" || !i.groupID
    );
    setNoTrustWalletAddress(noTrustAddress);
  }, [addresses]);

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
      hide: hasMultipleAddresses,
      disabled: skipKYC
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
    },
    {
      icon: "wallet-outline",
      title: "Trust Wallet",
      onClick: () => {},
      disabled: !selected
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
            addresses={noTrustWalletAddress}
            pagination={false}
            selectRow={selectRowConfig}
          />
        </Card>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Trust Wallet BTC Addresses</h4>
        </div>
        <Card>
          <AddressTable
            addresses={trustWalletAddress}
            pagination={false}
            selectRow={selectRowConfig}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default AddressesPage;
