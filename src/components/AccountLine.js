import React from "react";
import { Table } from "react-bootstrap";

export default function AccountLine({ bankInfo, details }) {
  console.log("DETAILS", details);
  return (
    <Table>
      <thead>
        <th>Account Number</th>
        <th>BSB</th>
        <th>Reference Number</th>
        <th>Amount</th>
      </thead>
      <tr>
        <td>{bankInfo?.number}</td>
        <td>{bankInfo?.bsb}</td>
        <td>{details?.depositHint?.depositReference}</td>
        <td>
          {details?.depositHint?.depositAmount + "." + details?.randomCent}
        </td>
      </tr>
    </Table>
  );
}
