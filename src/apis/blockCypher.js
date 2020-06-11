import axios from "axios";

const blockCypher = axios.create({
  baseURL: "https://api.blockcypher.com/v1/btc/main"
});

export default blockCypher;
