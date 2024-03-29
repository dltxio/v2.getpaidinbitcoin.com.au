import React from "react";
import TableWithHead from "components/Table";
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
  <TableWithHead
    data={logs}
    columnConfig={columnConfig}
    keyField="id"
    className="address-table"
    {...props}
  />
);

export default AddressHistoryTable;
