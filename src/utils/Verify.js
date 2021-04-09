import React from "react";
import gpib from "../apis/gpib";

export default class Verify extends React.Component {
  render() {
    return (
      <div
        id="digitalid-verify"
        className="d-flex justify-content-center"
      ></div>
    );
  }

  componentDidMount() {
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
            console.log(response);
          }
        },
        onClick: function (opts) {
          console.log(opts);
        },
        onKeepAlive: function () {}
      });
    };
  }
}
