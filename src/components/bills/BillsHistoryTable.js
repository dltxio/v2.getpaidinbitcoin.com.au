import React from "react";
import moment from "moment";
import TableWithHead from "components/Table";
import "./BillsTable.scss";

// dataField (key) props (value)
const columnConfig = {
  created: {
    children: "Date",
    dataFormat: (cell) => cell && moment(cell).format("DD-MM-YYYY HH:mm:ss")
  },
  label: {
    children: "Label"
  },
  billerCode: {
    children: "Biller Code"
  },
  fiat: {
    children: "Amount (AUD)"
  },
  btc: {
    children: "Amount (BTC)",
    dataFormat: (cell) => cell.toFixed(9)
  },
  btcPaid: {
    children: "Paid"
  }
};

const BillsHistoryTable = ({ bills, ...props }) => (
  <TableWithHead
    data={bills}
    columnConfig={columnConfig}
    keyField="id"
    className="bills-table"
    pagination
    {...props}
  />
);

export default BillsHistoryTable;
