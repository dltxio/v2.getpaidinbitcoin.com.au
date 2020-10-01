import React from "react";
import { SWRConfig } from "swr";
import gpib from "apis/gpib";
import Router from "components/Router";
import { AuthProvider } from "components/auth/Auth";
import "./App.scss";

const swrConfig = {
  fetcher: (url) => gpib.secure.get(url).then((res) => res.data),
  shouldRetryOnError: false
};

const App = () => (
  <SWRConfig value={swrConfig}>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </SWRConfig>
);

export default App;
