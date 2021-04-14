import React, { useEffect } from "react";
import gpib from "../apis/gpib";
import { mutate } from "swr";

const Verify = () => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://digitalid-sandbox.com/sdk/app.js";
    script.async = true;

    document.body.appendChild(script);

    script.onload = () => {
      /* Verify with Digital iD */
      window.digitalId.init({
        clientId: `${process.env.REACT_APP_DIGITAL_ID_CLIENT_ID}`,
        uxMode: "popup",
        onLoadComplete: function () {},
        onComplete: async function (msg) {
          if (msg && msg.code !== "" && msg.transaction_id !== "") {
            var response = await gpib.secure.post("/user/verifyid", {
              code: msg.code,
              transactionID: msg.transaction_id
            });
            if (response.status === 200) {
              //TODO refresh the page
              mutate("/");
            }
            if (response.status === 400) {
              //TODO show alert
            }
          }
        },
        onClick: function (opts) {
          console.log(opts);
        },
        onKeepAlive: function () {}
      });
    };
  }, []);
  return (
    <div id="digitalid-verify" className="d-flex justify-content-center"></div>
  );
};
export default Verify;
