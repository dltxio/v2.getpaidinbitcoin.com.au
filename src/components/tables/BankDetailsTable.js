import React from "react";
import LabelledTable from "./LabelledTable";
import { format as format$ } from "currency-formatter";

export default function BankDetailsTable({
  bankDetails,
  depositHints,
  userDetails
}) {
  const getAmount = () => {
    let amount = Number(depositHints?.depositAmount);
    if (userDetails?.randomCent) amount += Number(userDetails.randomCent / 100);
    return format$(amount, { code: "AUD" });
  };
  const columnConfig = [
    ["Account Name", bankDetails?.name],
    ["Account Number", bankDetails?.number],
    ["BSB", bankDetails?.bsb],
    ["Bank", bankDetails?.name],
    ["Amount", getAmount()]
  ];
  return <LabelledTable columns={columnConfig} />;
}
