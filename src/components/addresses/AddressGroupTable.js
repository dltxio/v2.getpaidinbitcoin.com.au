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
  id: {
    children: "ID",
    hidden: true
  }
};

const AddressGroupTable = ({ addresses, ...props }) => (
  <BaseTable
    data={addresses}
    columnConfig={columnConfig}
    className="address-table"
    selectOption="radio"
    {...props}
  />
);

export default AddressGroupTable;
