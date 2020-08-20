import React from "react";
import moment from "moment";
import Table from "./Table";
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

const columnOrder = ["Deposit", "Fee", "Exchange", "Transfer"].reverse();

const TransactionTable = ({ transactions = [], ...props }) => {
  const unStyled = transactions
    .sort((a, b) => columnOrder.indexOf(a.type) - columnOrder.indexOf(b.type))
    .sort(
      (a, b) =>
        (columnOrder[b.type.toLowerCase()] || Infinity) -
        (columnOrder[a.type.toLowerCase()] || Infinity)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .sort((a, b) => b.groupID - a.groupID)
    .map((t, id) => ({ id, ...t }));

  const data = unStyled.map((t, i) => {
    if (i !== 0 && t.groupID !== unStyled[i - 1].groupID) gid += 1;
    return { ...t, gid };
  });

  const formatRow = (row, i) => {
    return row.gid % 2 === 0 ? undefined : "transaction-table-row";
  };

  return (
    <Table
      data={data}
      columnConfig={columnConfig}
      options={tableOptions}
      trClassName={formatRow}
      striped={false}
      {...props}
    />
  );
};
export default TransactionTable;
