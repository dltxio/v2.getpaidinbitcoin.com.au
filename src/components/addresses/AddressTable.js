import React from "react";
import Table from "components/Table";
import "./AddressTable.scss";

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
  },
  id: {
    children: "ID",
    hidden: true
  }
};

const AddressTable = ({ addresses, ...props }) => (
  <Table
    data={addresses}
    columnConfig={columnConfig}
    keyField="id"
    className="address-table"
    {...props}
  />
);

export default AddressTable;
