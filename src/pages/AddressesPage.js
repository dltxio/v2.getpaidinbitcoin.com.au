import React, { useContext } from "react";
import useSWR from "swr";
import { ButtonGroup, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Layout from "components/layout/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { AuthContext } from "components/auth/Auth";
import Card from "components/Card";
import AddressTable from "components/addresses/AddressTable";
import AddressGroupTable from "components/addresses/AddressGroupTable";
import IconButton from "components/IconButton";
import useSelectedRow from "hooks/useSelectedRow";
import "./Dashboard.scss";

const AddressesPage = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const getAddressesUrl = `/user/${user.id}/address`;
  const [selected, , selectRowConfig] = useSelectedRow(null);
  const [selectedGroup, , selectGroupRowConfig] = useSelectedRow(null);
  const { data: addresses, error: fetchAddressError } = useSWR(getAddressesUrl);
  const isFetchingAddresses = !addresses && !fetchAddressError;
  const hasMultipleAddresses = addresses?.length > 1;
  const { data: settings, error: fetchSettingsError } = useSWR(
    `/settings/${user.id}`
  );
  const groupAddress = addresses?.filter((i) => i.groupID);
  const unGroupAddress = addresses?.filter((i) => !i.groupID);

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
      disabled: user?.idVerificationStatus !== 3
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
      disabled: !selected,
      hide: user?.idVerificationStatus !== 3
    },
    {
      icon: "archive-outline",
      title: "Archive",
      onClick: () => history.push(`/addresses/archive/${selected}`),
      disabled: !selected || unGroupAddress?.length === 1,
      hide: !hasMultipleAddresses
    },
    {
      icon: "wallet-outline",
      title: "Group Address",
      onClick: () => history.push(`/addresses/group/${selected}`),
      disabled: !selected || unGroupAddress.length === 1,
      hide: user?.idVerificationStatus !== 3 || !settings?.allowGroupedAddresses
    }
  ];

  const groupActions = [
    {
      icon: "add",
      title: "Add",
      onClick: () => history.push(`/addresses/groupAdd`),
      disabled: unGroupAddress?.length > 1
    },
    {
      icon: "create-outline",
      title: "Edit",
      onClick: () => history.push(`/addresses/groupEdit/${selectedGroup}`),
      disabled: !selectedGroup
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
          <ErrorMessage error={fetchAddressError || fetchSettingsError} />
          <Loader loading={isFetchingAddresses} />
          <Alert variant="secondary" className="mt-3">
            {alertText}
          </Alert>
          <AddressTable
            addresses={unGroupAddress}
            pagination={false}
            selectRow={selectRowConfig}
          />
        </Card>
        {settings?.allowGroupedAddresses && (
          <>
            <Card>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Group Addresses</h4>
                <div>
                  Percentage:{" "}
                  {groupAddress?.length > 0 && groupAddress[0].percent
                    ? groupAddress[0].percent
                    : "0"}{" "}
                  %
                </div>
                <div className="d-flex justify-content-start">
                  <ButtonGroup>
                    {groupActions.map(({ hide, ...props }, i) =>
                      hide ? null : <IconButton key={i} {...props} />
                    )}
                  </ButtonGroup>
                </div>
              </div>
              <AddressGroupTable
                addresses={groupAddress}
                pagination={false}
                selectRow={selectGroupRowConfig}
              />
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AddressesPage;
