import React from "react";
import TableWithHead from "components/Table";
import truncate from "../../utils/truncate";
import moment from "moment";
import { format as format$ } from "currency-formatter";

const columnConfig = {
  fixedAmount: {
    children: "Amount",
    width: "15%",
    dataFormat: (amt) => format$(truncate(amt, 8), { code: "AUD" })
  },
  firstName: {
    children: "First Name",
    width: "15%"
  },
  created: {
    children: "Referral Date",
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
    <TableWithHead
      data={referrals}
      columnConfig={columnConfig}
      options={tableOptions}
      striped={false}
    />
  );
};

export default ReferralTable;
