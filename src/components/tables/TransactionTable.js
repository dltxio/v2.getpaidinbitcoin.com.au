import React from "react";
import moment from "moment";
import { format as format$ } from "currency-formatter";
import Table from "./Table";
import prefixID from "../../utils/prefixID";

// dataField (key) props (value)
const columnConfig = {
  created: {
    children: "Created",
    dataFormat: (cell) => cell && moment(cell).format("DD-MM-YYYY"),
    dataSort: true
  },
  type: {
    children: "Type"
  },
  description: {
    children: "Description"
  },
  amount: {
    children: "Amount",
    tdStyle: { textAlign: "right" },
    thStyle: { textAlign: "right" }
  }
};

const blendTransfersAndDeposits = (transfers, deposits) => {
  const parsedTransfers = transfers.map((t) => ({
    id: prefixID(t.id, "T"),
    created: t.created,
    type: "Transfer",
    description: t.type,
    amount: `${t.amount} ${t.coin}`
  }));

  const parsedDepostis = deposits.map((d) => ({
    id: prefixID(d.id, "D"),
    created: d.created,
    type: "Deposit",
    description: d.reference,
    amount: format$(d.amount, { code: "AUD" })
  }));

  return [...parsedTransfers, ...parsedDepostis].sort((a, b) =>
    moment(a.created).isBefore(b.created) ? 1 : -1
  );
};

const tableOptions = {
  hideSizePerPage: true,
  sizePerPage: 5
};

const TransactionTable = ({ transfers, deposits, ...props }) => {
  const data = blendTransfersAndDeposits(transfers, deposits);

  return (
    <Table
      data={data}
      columnConfig={columnConfig}
      keyField="id"
      options={tableOptions}
      {...props}
    />
  );
};
export default TransactionTable;
