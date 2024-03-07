import React from "react";
import Table from "components/Table";
import "./AddressTable.scss";

// dataField (key) props (value)
const columnConfig = {
  message: {
    children: "Log",
    width: "60%"
  },
  ipAddress: {
    children: "IP Address",
    width: "18%"
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
