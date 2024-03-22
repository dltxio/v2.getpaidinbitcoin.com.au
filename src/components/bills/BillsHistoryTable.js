import React from "react";
import Table from "components/Table";
import "./BillsTable.scss";

// dataField (key) props (value)
const columnConfig = {
  created: {
    children: "Date"
  },
  billerCode: {
    children: "Biller Code"
  },
  fiat: {
    children: "Amount (AUD)"
  },
  btc: {
    children: "Amount (BTC)"
  },
  btcPaid: {
    children: "Paid"
  }
};

const BillsHistoryTable = ({ bills, ...props }) => (
  <Table
    data={bills}
    columnConfig={columnConfig}
    keyField="id"
    className="bills-table"
    {...props}
  />
);

export default BillsHistoryTable;
