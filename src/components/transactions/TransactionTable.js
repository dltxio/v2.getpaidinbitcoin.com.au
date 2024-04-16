import React from "react";
import moment from "moment";
import BaseTable from "components/BaseTable";
import "./TransactionTable.scss";

// dataField (key) props (value)
const columnConfig = {
  date: {
    children: "Created",
    dataFormat: (cell) => cell && moment(cell).format("DD-MM-YYYY")
  },
  type: {
    children: "Type"
  },
  reference: {
    children: "Description"
  },
  amount: {
    children: "Amount",
    tdStyle: { textAlign: "right" },
    thStyle: { textAlign: "right" }
  }
};

const tableOptions = {
  hideSizePerPage: true,
  sizePerPage: 10
};

let gid = 0;

const columnOrder = ["Deposit", "Fee", "Exchange", "Transfer"];

const TransactionTable = ({ transactions = [], ...props }) => {
  const unStyled = transactions
    .sort((a, b) => columnOrder.indexOf(a.type) - columnOrder.indexOf(b.type)) // Use set order when timestamps are equal
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort chronologically
    .sort((a, b) => b.groupID - a.groupID) // Sort by group reverse chronological order
    .map((t, id) => ({ id, ...t }));

  const data = unStyled.map((t, i) => {
    if (i !== 0 && t.groupID !== unStyled[i - 1].groupID) gid += 1;
    return { ...t, gid };
  });

  return (
    <BaseTable
      data={data}
      columnConfig={columnConfig}
      options={tableOptions}
      striped={false}
      {...props}
    />
  );
};
export default TransactionTable;
