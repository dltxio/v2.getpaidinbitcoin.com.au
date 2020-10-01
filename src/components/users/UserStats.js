import React from "react";
import { format as format$ } from "currency-formatter";
import LabelledTable from "components/LabelledTable";

const flattenData = (stats) => {
  return {
    totalBTC: stats?.stats?.transfers?.total || 0,
    totalAUD: stats?.stats?.deposits?.total || 0,
    depositCount: stats?.stats?.deposits?.count || 0,
    averageRate: stats?.stats?.transfers?.averageRate || 0,
    maxRate: stats?.stats?.transfers?.maxRate || 0,
    minRate: stats?.stats?.transfers?.minRate || 0
  };
};

const getColumns = (data) => {
  const map = {
    totalBTC: {
      label: "Total BTC Transferred",
      format: (v) => `${v || 0} BTC`
    },
    totalAUD: {
      label: "Total Fiat Deposited (AUD)",
      format: (v) => format$(v, { code: "AUD" })
    },
    depositCount: {
      label: "Deposit Count",
      format: (v) => v
    },
    averageRate: {
      label: "Average Purchase Price ($/BTC)",
      format: (v) => format$(v, { code: "AUD" })
    },
    maxRate: {
      label: "Max Price ($/BTC)",
      format: (v) => format$(v, { code: "AUD" })
    },
    minRate: {
      label: "Min Price ($/BTC)",
      format: (v) => format$(v, { code: "AUD" })
    }
  };

  return Object.keys(data).map((key) => {
    return [map[key].label, map[key].format(data[key])];
  });
};

const UserStats = ({ stats = {} }) => {
  const data = flattenData(stats);
  const columns = getColumns(data);

  return <LabelledTable columns={columns} hover={false} />;
};

export default UserStats;
