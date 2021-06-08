import React, { useEffect } from "react";
import gpib from "../apis/gpib";
import { mutate } from "swr";

const Verify = ({ setIdVerificationStatus, statuses }) => {
  useEffect(() => {
    const script = document.createElement("script");

    //sanbox src
    //script.src = "https://digitalid-sandbox.com/sdk/app.js"
    //live src
    script.src = "https://digitalid.com/sdk/app.js";
    script.async = true;

    document.body.appendChild(script);

    script.onload = () => {
      console.log(process.env.REACT_APP_DIGITAL_ID_CLIENT_ID)
      /* Verify with Digital iD */
      window.digitalId.init({
        //sanbox 
        //clientId: "ctid1rnjuWgFKN8eYJ7v8zRn4N",
        clientId: `${process.env.REACT_APP_DIGITAL_ID_CLIENT_ID}`,
        uxMode: "popup",
        onComplete: async function (msg) {
          if (msg.error) {
            if (msg.error === 'verification_cancelled') {
              // TODO cancelled logic
            }
            console.error(msg.error)
            return;
          }
          console.log(msg)
          // if (msg && msg.code !== "" && msg.transaction_id !== "") {
          //   var response = await gpib.secure.post("/user/verifyid", {
          //     code: msg.code,
          //     transactionID: msg.transaction_id
          //   });
          //   if (response.status === 200) {
          //     //TODO refresh the page
          //     setIdVerificationStatus(statuses.VERIFIED);
          //     mutate("/");
          //   }
          //   if (response.status === 400) {
          //     //TODO show alert
          //     setIdVerificationStatus(statuses.REJECTED);
          //     mutate("/")
          //   }
          // }
        }
      });
    };
  }, []);
  return (
    <div id="digitalid-verify" className="d-flex justify-content-center"></div>
  );
};
export default Verify;
