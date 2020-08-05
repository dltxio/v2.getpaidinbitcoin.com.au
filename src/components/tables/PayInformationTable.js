import React, { useContext } from "react";
import { format as format$ } from "currency-formatter";
import LabelledTable from "./LabelledTable";
import { AuthContext } from "../Auth";

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

  const columnConfig = [
    ["Account Name", bankDetails?.name],
    ["Account Number", bankDetails?.number],
    ["BSB", bankDetails?.bsb],
    ["Reference", ref],
    ["Amount", getAmount()]
  ];
  return <LabelledTable hover={false} columns={columnConfig} />;
}
