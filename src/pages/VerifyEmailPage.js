import React, { useEffect, useState, useContext } from "react";
import { mutate } from "swr";
import Layout from "components/layout/Layout";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { useHistory, useParams, useLocation } from "react-router-dom";
import gpib from "apis/gpib";
import { AuthContext } from "components/auth/Auth";

const useQuery = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};

const VerifyEmailPage = () => {
  // const { token } = useParams();
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [isVerifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  const query = useQuery();
  const token = query.get("token");
  const userId = query.get("userId");
  const expiry = query.get("expiry");

  if (!token) history.push("/");

  console.log(token);

  useEffect(() => {
    const verifytoken = async () => {
      try {
        await gpib.open.post("/user/verifyemail", {
          token,
          userId,
          expiry
        });
        await mutate(`/user/${user?.id}`, (state) => ({
          ...state,
          emailVerified: true
        }));
        setVerifying(false);
        history.push("/");
      } catch (e) {
        setError(e);
        setVerifying(false);
      }
    };
    verifytoken();
  }, [expiry, history, token, user.id, userId]);

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
