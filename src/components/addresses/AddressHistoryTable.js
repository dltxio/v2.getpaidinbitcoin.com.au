import React from "react";
import Table from "components/Table";
import "./AddressTable.scss";

// dataField (key) props (value)
const columnConfig = {
  log: {
    children: "Log",
    width: "50%"
  },
  ipAddress: {
    children: "IP Address"
  },
  created: {
    children: "Date"
  }
};

const AddressHistoryTable = ({ logs, ...props }) => (
  <Table
    data={logs}
    columnConfig={columnConfig}
    keyField="id"
    className="address-table"
    {...props}
  />
);

export default AddressHistoryTable;
