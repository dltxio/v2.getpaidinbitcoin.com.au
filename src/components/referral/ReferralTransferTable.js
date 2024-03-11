import React from "react";
import TableWithHead from "components/Table";
import prefixID from "../../utils/prefixID";
import moment from "moment";

const columnConfig = {
  referralID: {
    children: "ID",
    dataFormat: (cell) => prefixID(cell, "R")
  },
  referralAmount: {
    children: "Amount"
  },
  cryptoAmount: {
    children: "Crypto Amount"
  },
  tx: {
    children: "TXN ID"
  },
  coin: {
    children: "Coin",
    width: "10%"
  },
  address: {
    children: "Address"
  },
  createdDate: {
    children: "Transfer Date",
    dataFormat: (cell) => cell && moment(cell).format("DD-MM-YYYY")
  }
};
const tableOptions = {
  hideSizePerPage: true,
  sizePerPage: 5
};

const ReferralTransferTable = ({ referralTransfers }) => {
  return (
    <TableWithHead
      data={referralTransfers}
      columnConfig={columnConfig}
      options={tableOptions}
      striped={false}
    />
  );
};
export default ReferralTransferTable;
