import React from "react";
import Table from "./Table";

// dataField (key) props (value)
const columnConfig = {
  label: {
    children: "Label",
    width: "40%"
  },
  address1: {
    children: "Address",
    width: "40%"
  },

  percent: {
    children: "Percent",
    width: "10%"
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
