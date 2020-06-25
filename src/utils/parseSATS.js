import formatBTC from "./formatBTC";

const parseSATS = (sats = 0) => {
  const btc = Math.round(sats) / 100000000;
  return formatBTC(btc);
};

export default parseSATS;
