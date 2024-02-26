import React, { useEffect, useState, useContext } from "react";
import { mutate } from "swr";
import Layout from "components/layout/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isVerifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  if (!token) navigate("/");

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
        await mutate(`/user/${user?.id}`, (state) => ({
          ...state,
          emailVerified: true
        }));
        setVerifying(false);
        navigate("/");
      } catch (e) {
        setError(e);
        setVerifying(false);
      }
    };
    verifytoken();
  }, [navigate, token, user]);

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
