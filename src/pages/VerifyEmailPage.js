import React, { useEffect, useState } from "react";
import { mutate } from "swr";
import Layout from "../components/Layout";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import { useHistory, useParams } from "react-router-dom";
import gpib from "../apis/gpib";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const history = useHistory();
  const [isVerifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  if (!token) history.push("/");

  useEffect(() => {
    const verifytoken = async () => {
      try {
        await gpib.open.post(
          "/user/verifyemail",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setVerifying(false);
        await mutate("/user/status");
        history.push("/");
      } catch (e) {
        setError(e);
        setVerifying(false);
      }
    };
    verifytoken();
  }, [history, token]);

  return (
    <Layout>
      <div className="container py-5">
        <ErrorMessage error={error} />
        <Loader loading={isVerifying} />
      </div>
    </Layout>
  );
};

export default VerifyEmailPage;
