import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://api.blockcypher.com/v1/btc/test3"
    : "https://api.blockcypher.com/v1/btc/main";

const blockCypher = axios.create({
  baseURL
});

export default blockCypher;
