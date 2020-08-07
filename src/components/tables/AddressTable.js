import React from "react";
import Table from "./Table";

// dataField (key) props (value)
const columnConfig = {
  label: {
    children: "Label",
    width: "30%"
  },
  address1: {
    children: "Address"
  },
  percent: {
    children: "%",
    thStyle: {
      width: "15%",
      textAlign: "right"
    },
    tdStyle: {
      width: "15%",
      textAlign: "right"
    }
  }
};

const AddressTable = ({ addresses, ...props }) => (
  <Table
    data={addresses}
    columnConfig={columnConfig}
    keyField="id"
    {...props}
  />
);

export default AddressTable;
