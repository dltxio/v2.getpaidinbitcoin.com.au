import React, { useEffect, useState, useContext } from "react";
import { mutate } from "swr";
import Layout from "components/layout/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";

const useQuery = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};

const VerifyEmailPage = () => {
  const { token } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isVerifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  if (!token) navigate("/");

  console.log(token);
  console.log(userId);
  console.log(expiry);

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
  }, [navigate, token, user]);

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
