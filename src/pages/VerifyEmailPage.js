import React, { useEffect, useState, useContext } from "react";
import { mutate } from "swr";
import Layout from "components/layout/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { useHistory, useLocation } from "react-router-dom";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";

const useQuery = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};

const VerifyEmailPage = () => {
  const history = useHistory();
  const [isVerifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  const query = useQuery();
  
  const token = query.get("token");
  const userId = query.get("userid");
  const expiry = query.get("expiry");

  if (!token) history.push("/");

  console.log(token);
  console.log(userId);
  console.log(expiry);

  useEffect(() => {
    const verifytoken = async () => {
      try {
        const response = await gpib.open.post("/user/verifyemail", {
          signature: token,
          userId,
          expiry
        });

        console.log(response);

        setVerifying(false);
        history.push("/");
      } catch (e) {
        setError(e);
        setVerifying(false);
      }
    };
    verifytoken();
  }, [expiry, history, token, userId]);

  return (
    <Layout>
      <div className="container py-5">
        <h2>Verify your email</h2>
        <ErrorMessage error={error} />
        <Loader loading={isVerifying} />
        {/* {!isVerifying && !error && ()} */}
      </div>
    </Layout>
  );
};

export default VerifyEmailPage;
