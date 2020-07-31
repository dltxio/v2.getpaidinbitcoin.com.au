import React, { useState, useEffect } from "react";
import Loader from "../Loader";
import blockCypher from "../../apis/blockCypher";
import { Cache } from "memory-cache";
import parseSATS from "../../utils/parseSATS";
import LabelledTable from "./LabelledTable";

const defaultAddresses = [];

const cache = new Cache();

const AddressTableWithBalance = ({ addresses = defaultAddresses }) => {
  const [data, setData] = useState(defaultAddresses);

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

  const renderBalance = (b) => {
    const hasValue = b !== undefined;
    return hasValue ? (
      parseSATS(b) + " BTC"
    ) : (
      <Loader loading noStretch noBackground diameter="1rem" />
    );
  };

  const columnConfig = data.map((a) => [a.label, renderBalance(a.balance)]);

  return <LabelledTable hover={false} columns={columnConfig} />;
};
export default AddressTableWithBalance;
