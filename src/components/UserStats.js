import React from "react";
import { format as format$ } from "currency-formatter";
import { Table } from "react-bootstrap";

const statKeys = {
  totalBTC: {
    label: "Total BTC",
    format: (v) => `${v || 0} BTC`
  },
  totalAUD: {
    label: "Total Fiat Deposited (AUD)",
    format: (v) => format$(v, { code: "AUD" })
  },
  depositCount: {
    label: "Deposit Count"
  },
  averagePurchasePrice: {
    label: "Average Purchase Price ($/BTC)",
    format: (v) => format$(v, { code: "AUD" })
  },
  maxPrice: {
    label: "Max Price ($/BTC)",
    format: (v) => format$(v, { code: "AUD" })
  },
  minPrice: {
    label: "Min Price ($/BTC)",
    format: (v) => format$(v, { code: "AUD" })
  },
  referralRevenueEarned: {
    label: "Referral Revenue (AUD)",
    format: (v) => format$(v, { code: "AUD" })
  }
};

const UserStats = ({ stats }) => {
  return (
    <Table>
      <tbody>
        {Object.keys(statKeys).map((key) => (
          <tr key={key}>
            <td>{statKeys[key].label}</td>
            <td style={{ textAlign: "right", minWidth: "30%" }}>
              {statKeys[key].format
                ? statKeys[key].format(stats[key])
                : stats[key]}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserStats;
