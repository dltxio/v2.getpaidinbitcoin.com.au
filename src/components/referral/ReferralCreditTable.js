import React from "react";
import Table from "components/Table";

const columnConfig = {
  cryptoAmount: {
    children: "Crypto Amount"
  },
  coin: {
    children: "Coin"
  },
  transferCreated: {
    children: "Transfered"
  }
};
const tableOptions = {
  hideSizePerPage: true,
  sizePerPage: 10
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
