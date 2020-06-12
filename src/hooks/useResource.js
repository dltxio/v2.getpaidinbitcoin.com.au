import { useEffect, useState, useMemo } from "react";
import gpib from "../apis/gpib";
import axios from "axios";

const defaultOptions = { useSecureApi: true };

export default function useResource(url, defaultData = {}, _options) {
  const options = { ...defaultOptions, ..._options };
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const { baseURL, useSecureApi } = options;
  const api = useMemo(() => {
    if (baseURL) return axios.create({ baseURL });
    return useSecureApi ? gpib.secure : gpib.open;
  }, [baseURL, useSecureApi]);

  const refresh = () => setToggle(!toggle);

  useEffect(() => {
    if (!url) return;
    (async () => {
      setIsLoading(true);
      try {
        const response = await api.get(url);
        setData(response.data);
      } catch (e) {
        let msg = e?.response?.data?.error || e.message;
        setError(msg);
      }
      setIsLoading(false);
    })();
  }, [url, toggle, api]);
  return [url ? data : defaultData, error, isLoading, refresh];
}
