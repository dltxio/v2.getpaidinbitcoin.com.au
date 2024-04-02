import React from "react";
import moment from "moment";
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
    children: "Date",
    dataFormat: (cell) => cell && moment(cell).format("DD-MM-YYYY HH:mm:ss"),
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
