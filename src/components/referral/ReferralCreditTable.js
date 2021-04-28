import React from "react";
import Table from "components/Table";

const columnConfig = {
  cryptoAmount: {
    children: "Crypto Amount",
    dataFormat: (cell) => {
      return Number(cell).toPrecision(3);
    }
  },
  coin: {
    children: "Coin",
    width: "12%"
  },
  transferCreated: {
    children: "Transfered",
    width: "20%",
    dataFormat: (cell) => {
      return cell.toString().charAt().toUpperCase() + cell.toString().slice(1);
    }
  }
};
const tableOptions = {
  hideSizePerPage: true,
  sizePerPage: 5
};

const ReferralCreditTable = ({ referralCredits }) => {
  return (
    <Table
      data={referralCredits}
      columnConfig={columnConfig}
      options={tableOptions}
      striped={false}
    />
  );
};
export default ReferralCreditTable;
