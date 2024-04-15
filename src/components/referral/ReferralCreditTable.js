import React from "react";
import BaseTable from "components/BaseTable";

const columnConfig = {
  cryptoAmount: {
    children: "Crypto Amount",
    dataFormat: (cell) => {
      return Number(cell).toFixed(8);
    }
  },
  coin: {
    children: "Coin",
    width: "20%"
  },
  transferCreated: {
    children: "Transferred",
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
    <BaseTable
      data={referralCredits}
      columnConfig={columnConfig}
      options={tableOptions}
    />
  );
};
export default ReferralCreditTable;
