import truncate from "./truncate";

const formatBTC = (btc = 0) => {
  return truncate(btc, 8).toFixed(8);
};

export default formatBTC;
