import React from "react";
import moment from "moment";
import BaseTable from "components/BaseTable";
import "./BillsTable.scss";

// dataField (key) props (value)
const columnConfig = {
  created: {
    children: "Date",
    dataFormat: (cell) => cell && moment(cell).format("DD-MM-YYYY HH:mm")
  },
  label: {
    children: "Label"
  },
  billerCode: {
    children: "Biller Code"
  },
  fiat: {
    children: "Amount (AUD)",
    dataFormat: (cell) => cell.toFixed(2)
  },
  btc: {
    children: "Amount (BTC)",
    dataFormat: (cell) => cell.toFixed(8)
  },
  btcPaid: {
    children: "Paid",
    dataFormat: (cell) => cell && moment(cell).format("DD-MM-YYYY HH:mm")
  }
};

const options = {
  order: { dataField: "created", order: "des", dataFormat: (cell) => moment(cell).valueOf() },
  pagination: true
};

const BillsHistoryTable = ({ bills, ...props }) => (
  <BaseTable
    data={bills}
    columnConfig={columnConfig}
    className="bills-table"
    options={options}
    {...props}
  />
);

export default BillsHistoryTable;
