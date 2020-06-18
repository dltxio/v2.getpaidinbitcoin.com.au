import React, { useState, useEffect } from "react";
import Table from "./Table";
import Loader from "../Loader";
import blockCypher from "../../apis/blockCypher";

const columnConfig = {
  address1: {
    children: "Address",
    tdStyle: {
      overflowWrap: "break-word",
      whiteSpace: "normal"
    },
    width: "50%"
  },
  label: {
    children: "Label"
  },
  balance: {
    children: "Balance",
    tdStyle: { textAlign: "right" },
    thStyle: { textAlign: "right" },
    dataFormat: (v) => {
      const hasValue = v !== undefined && v !== null;
      return hasValue ? `${v} BTC` : <Loader loading noStretch noBackground />;
    }
  }
};

const tableOptions = {
  hideSizePerPage: true,
  sizePerPage: 5
};

const defaultAddresses = [];

const TransactionTable = ({ addresses = defaultAddresses, ...props }) => {
  const [data, setData] = useState();

  useEffect(() => {
    const addr = addresses.slice(0, 2);
    setData(addr);
    (async () => {
      const balances = await Promise.all(
        addr.map(async (a) => {
          const { data: res } = await blockCypher.get(
            `/addrs/${a.address1}/balance`
          );
          return res.balance;
        })
      );
      const withBalances = balances.map((balance, i) => {
        const newAddr = addr[i];
        newAddr.balance = balance;
        return newAddr;
      });
      setData(withBalances);
    })();
  }, [addresses]);

  return (
    <Table
      data={data}
      columnConfig={columnConfig}
      keyField="id"
      options={tableOptions}
      {...props}
    />
  );
};
export default TransactionTable;
