import axios from "axios";

const blockCypher = axios.create({
  baseURL: process.env.REACT_APP_BLOCKCYPHER_URL
});

export default blockCypher;
