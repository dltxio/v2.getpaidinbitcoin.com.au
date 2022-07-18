import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import qs from "qs";
import { Button } from "react-bootstrap";
import Layout from "components/layout/Layout";
import Card from "components/Card";
import RegisterForm from "components/auth/RegisterForm";
import IdemRegisterForm from "components/auth/IdemRegisterForm";
import gpib from "../apis/gpib";

const urlCheck = (locationFirstIndex, locationSecondIndex) => {
  if (locationFirstIndex >= 0 && locationSecondIndex > 0) {
    return true;
  }

  return false;
};

const Register = () => {
  const history = useHistory();
  const location = useLocation();
  const referralCode =
    location?.search &&
    qs.parse(location.search, { ignoreQueryPrefix: true })?.referralCode;
  const firstName =
    location?.search &&
    qs.parse(location.search, { ignoreQueryPrefix: true })?.first;
  const lastName =
    location?.search &&
    qs.parse(location.search, { ignoreQueryPrefix: true })?.last;
  const email =
    location?.search &&
    qs.parse(location.search, { ignoreQueryPrefix: true })?.email;

  const [corporate, setCorporate] = useState();

  const locationFirstIndex = location.pathname.indexOf("/");
  const locationSecondIndex = location.pathname.indexOf(
    "/",
    locationFirstIndex + 1
  );
  const nameAbbreviation = location.pathname.substring(
    locationFirstIndex + 1,
    locationSecondIndex
  );

  const enterprise = urlCheck(locationFirstIndex, locationSecondIndex);
  // const useIdem = process.env.REACT_APP_IDEM_URL ? true : false;

  useEffect(() => {
    const fetchEnterprise = async () => {
      if (nameAbbreviation && enterprise) {
        try {
          const fetchcorporate = await gpib.open.get(
            `/enterprise/${nameAbbreviation}`
          );
          if (fetchcorporate) setCorporate(fetchcorporate.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchEnterprise();
  }, [nameAbbreviation, enterprise]);

  return (
    <Layout navLinks={[]}>
      <div className="d-flex flex-column justify-content-center container align-items-center">
        <div className="p-3 mt-4">
          <h3>
            Welcome to Get Paid In Bitcoin, the easiest way to receive bitcoin
            in your weekly wages.
          </h3>
          <br></br>
          {corporate ? (
            <>
              <div>
                Get Paid in Bitcoin is working with {corporate?.name} to provide
                the option of receiving a portion of their wages in bitcoin.
                <br></br>
                By completing this simple registration form using your employer
                provided email address, you’ll be joining the thousands of
                Australians that use GPIB to receive bitcoin in their wages.
              </div>
            </>
          ) : (
            <>
              By completing this simple registration form, you’ll be joining the
              thousands of Australians that use GPIB to receive bitcoin in their
              wages. <br></br>You will also be eligible to participate in our
              referral program when you refer your friends and work mates and
              receive additional bitcoin payments.<br></br>
            </>
          )}
          <p></p>We look forward to processing your first bitcoin pay soon.
          <br></br>
          <p></p>From the GPIB Team.
        </div>
        <div className="d-flex justify-content-center container align-items-center">
          <Card
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ flex: 1, maxWidth: "40rem" }}
          >
            <RegisterForm
              enterprise={enterprise}
              logo={corporate?.logoURL}
              initialValues={{ firstName, lastName, email, referralCode }}
              lockReferralCode={referralCode}
            />
            <Button
              block
              variant="link"
              className="mt-2"
              onClick={() => history.push("/login")}
            >
              Have an account? Log in
            </Button>
          </Card>
          {/* { useIdem ? ( */}
          {/* </div>
        <div className="d-flex justify-content-center container align-items-center"> */}
          <Card
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ flex: 1, maxWidth: "40rem" }}
          >
            <IdemRegisterForm
              initialValues={{ email }}
              lockReferralCode={referralCode}
            />
          </Card>
          {/* )} */}
        </div>
      </div>
    </Layout>
  );
};

export default Register;
