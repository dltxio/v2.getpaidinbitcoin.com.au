import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "components/layout/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import gpib from "apis/gpib";

const useQuery = () => {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
};

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [isVerifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  const query = useQuery();

  const token = query.get("token");
  const userId = query.get("userid");
  const expiry = query.get("expiry");

  if (!token) navigate("/");

  useEffect(() => {
    const verifytoken = async () => {
      try {
        await gpib.open.post("/user/verifyemail", {
          signature: token,
          userId,
          expiry
        });

        setVerifying(false);
        navigate("/");
      } catch (e) {
        setError(e);
        setVerifying(false);
      }
    };
    verifytoken();
  }, [expiry, token, userId]);

  return (
    <Layout>
      <div className="container py-5">
        <h2>Verify your email</h2>
        <ErrorMessage error={error} />
        <Loader loading={isVerifying} />
      </div>
    </Layout>
  );
};

export default VerifyEmailPage;
