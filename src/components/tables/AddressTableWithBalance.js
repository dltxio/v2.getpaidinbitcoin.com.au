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
    children: "Balance BTC",
    tdStyle: { textAlign: "right" },
    thStyle: { textAlign: "right" },
    dataFormat: (v) => {
      const hasValue = v !== undefined;
      return hasValue ? (
        parseSATS(v)
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

const AddressTableWithBalance = ({
  addresses = defaultAddresses,
  ...props
}) => {
  const [data, setData] = useState();

  useEffect(() => {
    cache.clear();
  }, []);

  useEffect(() => {
    setData(addresses);
    (async () => {
      const balances = await Promise.all(
        addresses.map(async (a) => {
          const url = `/addrs/${a.address1}/balance`;
          const cached = cache.get(url);
          if (cached !== null) return cached;
          const { data: res } = await blockCypher.get(url);
          cache.put(url, res.balance);
          return res.balance;
        })
      );
      const withBalances = balances.map((balance, i) => {
        const newAddr = addresses[i];
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
export default AddressTableWithBalance;
