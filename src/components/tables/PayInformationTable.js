import React, { useContext } from "react";
import { format as format$ } from "currency-formatter";
import LabelledTable from "./LabelledTable";
import { AuthContext } from "../Auth";
import ReactTooltip from "react-tooltip";

export default function BankDetailsTable({
  bankDetails,
  depositHints,
  userDetails
}) {
  const { user } = useContext(AuthContext);
  const ref = user?.id.slice(-5).toUpperCase();
  const getAmount = () => {
    let amount = Number(depositHints?.depositAmount);
    if (userDetails?.randomCent) amount += Number(userDetails.randomCent / 100);
    return format$(amount, { code: "AUD" });
  };

  const randomCentMessage = `In your case this is $0.${userDetails?.randomCent}. This is an additional measure to help us identify transfers we receive from your employer.`;
  const columnConfig = [
    ["Account Name", bankDetails?.name],
    ["Account Number", bankDetails?.number],
    ["BSB", bankDetails?.bsb],
    ["Your Unique Reference", ref],
    [
      <span>
        <span>Amount (including a </span>
        <a data-tip={randomCentMessage}>random cent</a>
        <span>)</span>
        <ReactTooltip place="bottom" multiline />
      </span>,
      getAmount()
    ]
  ];
  return <LabelledTable hover={false} columns={columnConfig} />;
}
