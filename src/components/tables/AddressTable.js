import React, { useState, useEffect } from "react";
import Table from "./Table";
import Loader from "../Loader";
import blockCypher from "../../apis/blockCypher";
import { Cache } from "memory-cache";
import parseSATS from "../../utils/parseSATS";

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
      const hasValue = v !== undefined;
      return hasValue ? (
        `${parseSATS(v)} BTC`
      ) : (
        <Loader loading noStretch noBackground />
      );
    }
  }
};

const tableOptions = {
  hideSizePerPage: true,
  sizePerPage: 5
};

const defaultAddresses = [];

const cache = new Cache();

const AddressTable = ({ addresses = defaultAddresses, ...props }) => {
  const [data, setData] = useState();

  useEffect(() => {
    cache.clear();
  }, []);

  useEffect(() => {
    const addr = addresses.slice(0, 2);
    setData(addr);
    (async () => {
      const balances = await Promise.all(
        addr.map(async (a) => {
          const url = `/addrs/${a.address1}/balance`;
          const cached = cache.get(url);
          if (cached !== null) return cached;
          const { data: res } = await blockCypher.get(url);
          cache.put(url, res.balance);
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
export default AddressTable;
