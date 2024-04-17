import React, { useContext, useState } from "react";
import useSWR from "swr";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "components/auth/Auth";
import Layout from "components/layout/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import Card from "components/Card";
import AddressTable from "components/addresses/AddressTable";
import AddressGroupTable from "components/addresses/AddressGroupTable";
import AddressHistoryTable from "components/addresses/AddressHistoryTable";
import AddressEditModal from "components/addresses/AddressEditModal";
import AddressSwapModal from "components/addresses/AddressSwapModal";
import AddressAddModal from "components/addresses/AddressAddModal";
import AddressArchiveModal from "components/addresses/AddressArchiveModal";
import AddressGroupAddModal from "components/addresses/AddressGroupAddModal";
import AddressGroupEditModal from "components/addresses/AddressGroupEditModal";
import "./Dashboard.scss";

const AddressesPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const getAddressesUrl = `/user/${user.id}/address`;
  const { data: addresses, error: fetchAddressError } = useSWR(getAddressesUrl);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const isFetchingAddresses = !addresses && !fetchAddressError;
  const [selectedModal, setSelectedModal] = useState(null);
  const hasMultipleAddresses = addresses?.length > 1;
  const { data: settings, error: fetchSettingsError } = useSWR(
    `/settings/${user.id}`
  );
  const { data: address_history } = useSWR(`/addresshistory`);
  const groupAddress = addresses?.filter((a) => a.groupID);
  const unGroupAddress = addresses?.filter((a) => !a.groupID);
  const selectedUngroupAddress = unGroupAddress && unGroupAddress[selectedRow];
  const selectedGroupAddress = groupAddress && groupAddress[selectedGroup];
  const alertText = hasMultipleAddresses
    ? `If you wish to change your bitcoin address you can swap your desired address to a new bitcoin address.`
    : `Your payment can be sent up to two bitcoin addresses. For example,
        you may want to split your payment and send 50% to a cold storage
        wallet and 50% to a hot wallet.`;

  const modal = {
    ADD: 1,
    EDIT: 2,
    SWAP: 3,
    ARCHIVE: 4,
    GROUP_ADDRESS: 5,
    GROUP_ADD: 6,
    GROUP_EDIT: 7
  };


  const actionButtons = (
    <>
      <Button
        className="mb-1 ms-1"
        onClick={() => setSelectedModal(modal.ADD)}
        disabled={user?.idVerificationStatus !== 3}
        hidden={hasMultipleAddresses}
      >
        <span>Add </span>
      </Button>
      <Button
        className="mb-1 ms-1"
        onClick={() => setSelectedModal(modal.EDIT)}
        disabled={selectedRow === null}
      >
        <span>Edit </span>
      </Button>
      <Button
        className="mb-1 ms-1"
        onClick={() => setSelectedModal(modal.SWAP)}
        disabled={selectedRow === null}
        hidden={user?.idVerificationStatus !== 3}
      >
        <span>Swap </span>
      </Button>
      <Button
        className="mb-1 ms-1"
        onClick={() => setSelectedModal(modal.ARCHIVE)}
        disabled={selectedRow === null || unGroupAddress?.length === 1}
        hidden={!hasMultipleAddresses}
      >
        <span>Archive </span>
      </Button>
      <Button
        className="mb-1 ms-1"
        onClick={() => setSelectedModal(modal.GROUP_ADDRESS)}
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

  const onModalDismiss = () => {
    setSelectedModal(null);
  };

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
            selectOption="radio"
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
                <div className="d-flex justify-content-start">
                  {groupActionButtons}
                </div>
              </div>
              <AddressGroupTable
                addresses={groupAddress}
                selectedRow={selectedGroup}
                setSelectedRow={setSelectedGroup}
              />
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

      <AddressAddModal
        isOpen={selectedModal === modal.ADD}
        addresses={addresses}
        onDismiss={onModalDismiss}
        hasMultipleAddresses={hasMultipleAddresses}
      />
      <AddressEditModal
        address={selectedUngroupAddress}
        isOpen={selectedModal === modal.EDIT}
        onDismiss={onModalDismiss}
        hasMultipleAddresses={hasMultipleAddresses}
      />
      <AddressSwapModal
        address={selectedUngroupAddress}
        isOpen={selectedModal === modal.SWAP}
        onDismiss={onModalDismiss}
      />
      <AddressArchiveModal
        isOpen={selectedModal === modal.ARCHIVE}
        onDismiss={onModalDismiss}
        address={selectedUngroupAddress}
      />
      <AddressGroupEditModal
        isOpen={selectedModal === modal.GROUP_ADDRESS}
        onDismiss={onModalDismiss}
        address={selectedUngroupAddress}
      />
      <AddressGroupAddModal
        isOpen={selectedModal === modal.GROUP_ADD}
        onDismiss={onModalDismiss}
        groupAddresses={groupAddress}
      />
      <AddressGroupEditModal
        isOpen={selectedModal === modal.GROUP_EDIT}
        onDismiss={onModalDismiss}
        address={selectedGroupAddress}
      />
    </Layout>
  );
};

export default AddressesPage;
