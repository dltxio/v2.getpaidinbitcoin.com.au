import React, { useEffect } from "react";
import { mutate } from "swr";
import gpib from "../apis/gpib";

const VerifyWithDigitalID = ({ setIdVerificationStatus, statuses, user }) => {
  useEffect(() => {
    const scriptExist = document.getElementById("digitalIdScript");
    if (scriptExist) {
      scriptExist.remove();
    }

    const script = document.createElement("script");
    document.body.appendChild(script);

    script.onload = () => {
      /* Verify with Digital iD */
      window.digitalId.init({
        clientId: `${process.env.REACT_APP_DIGITAL_ID_CLIENT_ID}`,
        uxMode: "popup",
        onComplete: async function (msg) {
          if (msg.error) {
            if (msg.error === "verification_cancelled") {
              // TODO cancelled logic
              setIdVerificationStatus(statuses.CANCELLED);
            }
            return;
          }
          if (msg && msg.code !== "" && msg.transaction_id !== "") {
            var response = await gpib.secure.post("/user/digitalId", {
              code: msg.code,
              transactionID: msg.transaction_id
            });
            if (response.status === 200) {
              setIdVerificationStatus(statuses.VERIFIED);
            }
            if (response.status === 400) {
              setIdVerificationStatus(statuses.REJECTED);
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));
            await mutate(user && `/user/${user.id}`);
          }
        }
      });
    };
    script.src = `${process.env.REACT_APP_DIGITAL_SOURCE}`;
    script.id = "digitalIdScript";

    script.async = true;
  }, []);
  return (
    <div id="digitalid-verify" className="d-flex justify-content-center"></div>
  );
};
export default VerifyWithDigitalID;
