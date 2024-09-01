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
    {/* <GoogleOAuthProvider clientId="772977261943-mku9n12cbje2ndngtc0um30p2ed4n56e.apps.googleusercontent.com"> */}
      <AuthProvider>
        <Router />
      </AuthProvider>
    {/* </GoogleOAuthProvider> */}
  </SWRConfig>
);

export default App;
