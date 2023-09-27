import React, { useContext, useState } from "react";
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
import AddressHistoryTable from "components/addresses/AddressHistoryTable";
import IconButton from "components/IconButton";
import useSelectedRow from "hooks/useSelectedRow";
import "./Dashboard.scss";
import gpib from "apis/gpib";

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
  const { data: address_history } = useSWR(
    `/addresshistory/user/${user.id}`
  );
  const groupAddress = addresses?.filter((i) => i.groupID);
  const unGroupAddress = addresses?.filter((i) => !i.groupID);
  const hasCardAddress = unGroupAddress?.filter(
    (i) => i.label === "Cryptospend"
  );
  const [message, setMessage] = useState({ type: "", value: "" });
  const [applying, setApplying] = useState(false);
  const alertText = hasMultipleAddresses
    ? `If you wish to change your bitcoin address you can swap your desired address to a new bitcoin address.`
    : `Your payment can be sent up to two bitcoin addresses. For example,
        you may want to split your payment and send 50% to a cold storage
        wallet and 50% to a hot wallet.`;

  const applyCard = async () => {
    setApplying(true);
    try {
      await gpib.secure.get("/card/apply");
      setMessage({
        type: "success",
        value: "Card applied successfully, please check your email."
      });
    } catch (error) {
      console.log(error);
      setMessage({ type: "danger", value: "Failed to apply card" });
    }
    setApplying(false);
  };

  const actions = [
    {
      icon: "card",
      title: "Apply Card",
      onClick: () => applyCard(),
      hide: hasCardAddress.length > 0,
      disabled: hasCardAddress.length > 0
    },
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
          <Loader loading={isFetchingAddresses || applying} />
          {message.value && (
            <Alert variant={message.type}>{message.value}</Alert>
          )}
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
        <Card>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>History</h4>
            <AddressHistoryTable logs={address_history} />
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AddressesPage;
