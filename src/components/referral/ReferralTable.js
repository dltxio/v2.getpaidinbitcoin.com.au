import React from "react";
import Table from "components/Table";
import truncate from "../../utils/truncate";
import moment from "moment";

const columnConfig = {
  fixedAmount: {
    children: "Amount",
    width: "15%",
    dataFormat: (amt) => truncate(amt, 8)
  },
  firstName: {
    children: "First Name",
    width: "15%"
  },
  lastName: {
    children: "Last Name",
    width: "15%"
  },
  created: {
    children: "Created",
    width: "15%",
    dataFormat: (cell) => cell && moment(cell).format("DD-MM-YYYY")
  }
};
const tableOptions = {
  hideSizePerPage: true,
  sizePerPage: 5
};

const ReferralTable = ({ referrals }) => {
  return (
    <Table
      data={referrals}
      columnConfig={columnConfig}
      options={tableOptions}
      striped={false}
    />
  );
};
export default ReferralTable;
