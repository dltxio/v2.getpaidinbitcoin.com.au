import React from "react";
import BaseTable from "components/BaseTable";
import "./AddressTable.scss";

// dataField (key) props (value)
const columnConfig = {
  label: {
    children: "Label"
  },
  address1: {
    children: "Address"
  },
  percent: {
    children: "%"
  },
  id: {
    children: "ID",
    hidden: true
  }
};

const AddressTable = ({ addresses, ...props }) => (
  <BaseTable
    data={addresses}
    columnConfig={columnConfig}
    selectOption="radio"
    className="address-table"
    {...props}
  />
);

export default AddressTable;
