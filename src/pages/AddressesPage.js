import React, { useContext, useState } from "react";
import useSWR from "swr";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Layout from "components/layout/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { AuthContext } from "components/auth/Auth";
import Card from "components/Card";
import AddressTable from "components/addresses/AddressTable";
import AddressGroupTable from "components/addresses/AddressGroupTable";
import AddressHistoryTable from "components/addresses/AddressHistoryTable";
import "./Dashboard.scss";

const AddressesPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const getAddressesUrl = `/user/${user.id}/address`;
  const { data: addresses, error: fetchAddressError } = useSWR(getAddressesUrl);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const isFetchingAddresses = !addresses && !fetchAddressError;
  const hasMultipleAddresses = addresses?.length > 1;
  const { data: settings, error: fetchSettingsError } = useSWR(
    `/settings/${user.id}`
  );
  const { data: address_history } = useSWR(`/addresshistory`);
  const groupAddress = addresses?.filter((a) => a.groupID);
  const unGroupAddress = addresses?.filter((a) => !a.groupID);
  const alertText = hasMultipleAddresses
    ? `If you wish to change your bitcoin address you can swap your desired address to a new bitcoin address.`
    : `Your payment can be sent up to two bitcoin addresses. For example,
        you may want to split your payment and send 50% to a cold storage
        wallet and 50% to a hot wallet.`;

  const actionButtons = (
    <>
      <Button
        className="mb-1 ms-1"
        onClick={() => navigate("/addresses/add")}
        disabled={user?.idVerificationStatus !== 3 || hasMultipleAddresses}
      >
        <span>Add </span>
      </Button>
      <Button
        className="mb-1 ms-1"
        onClick={() =>
          navigate(`/addresses/edit/${unGroupAddress[selectedRow].id}`)
        }
        disabled={selectedRow === null}
      >
        <span>Edit </span>
      </Button>
      <Button
        className="mb-1 ms-1"
        onClick={() =>
          navigate(`/addresses/swap/${unGroupAddress[selectedRow].id}`)
        }
        disabled={selectedRow === null}
        hidden={user?.idVerificationStatus !== 3}
      >
        <span>Swap </span>
      </Button>
      <Button
        className="mb-1 ms-1"
        onClick={() =>
          navigate(`/addresses/archive/${unGroupAddress[selectedRow].id}`)
        }
        disabled={selectedRow === null || unGroupAddress?.length === 1}
        hidden={!hasMultipleAddresses}
      >
        <span>Archive </span>
      </Button>
      <Button
        className="mb-1 ms-1"
        onClick={() =>
          navigate(`/addresses/group/${unGroupAddress[selectedRow].id}`)
        }
        disabled={selectedRow === null || unGroupAddress.length === 1}
        hidden={
          user?.idVerificationStatus !== 3 || !settings?.allowGroupedAddresses
        }
      >
        <span>Group Address </span>
      </Button>
    </>
  );

  const groupActionButtons = (
    <>
      {" "}
      <Button
        className="mb-1 ms-1"
        onClick={() => navigate(`/addresses/groupAdd`)}
        disabled={unGroupAddress?.length > 1}
      >
        <span>Add </span>
      </Button>
      <Button
        className="mb-1 ms-1"
        onClick={() =>
          navigate(
            `/addresses/groupEdit/${groupAddress[selectedGroup].groupID}`
          )
        }
        disabled={selectedGroup === null}
      >
        <span>Edit </span>
      </Button>
    </>
  );

  return (
    <Layout activeTab="Addresses">
      <div className="container py-5">
        <Card>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>BTC Addresses</h4>
          </div>
          <ErrorMessage error={fetchAddressError || fetchSettingsError} />
          <Loader loading={isFetchingAddresses} />
          <Alert variant="secondary" className="mt-3">
            {alertText}
          </Alert>
          <AddressTable
            addresses={unGroupAddress}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
          {actionButtons}
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
              </div>
              <AddressGroupTable
                addresses={groupAddress}
                selectedRow={selectedGroup}
                setSelectedRow={setSelectedGroup}
              />
                <div className="d-flex justify-content-start">
                  {groupActionButtons}
                </div>
            </Card>
          </>
        )}
        <Card>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>History</h4>
          </div>
          <AddressHistoryTable logs={address_history} />
        </Card>
      </div>
    </Layout>
  );
};

export default AddressesPage;
