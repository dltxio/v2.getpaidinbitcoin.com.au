import React from "react";
import Table from "components/Table";

const columnConfig = {
  cryptoAmount: {
    children: "Crypto Amount"
  },
  coin: {
    children: "Coin",
    width: "20%"
  },
  transferCreated: {
    children: "Transfered",
    width: "25%",
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
