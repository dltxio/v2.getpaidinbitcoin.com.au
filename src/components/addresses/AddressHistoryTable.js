import React from "react";
import moment from "moment";
import BaseTable from "components/BaseTable";
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

const options = {
  pagination: true
};

const AddressHistoryTable = ({ logs, ...props }) => (
  <BaseTable
    data={logs}
    columnConfig={columnConfig}
    keyField="id"
    className="address-table"
    options={options}
    {...props}
  />
);

export default AddressHistoryTable;
