import React from "react";
import Card from "components/Card";
import "./RegisterForm.scss";
import IdemQRCode from "components/IdemQRCode";

const IDEMRegisterForm = ({ initialValues: _iv, logo }) => {

  return (
    <Card style={{ width: 500, height: 410 }}>
      <div></div>
      <div className="mb-5 mt-2 flex justify-content-center">
        <h3>Register with IDEM</h3>
      </div>
      <IdemQRCode />
      <div className="mt-5">
        <p>IDEM is a decentralised identity app using PGP and Verifiable Credentials.  Download from the App Store.</p>
      </div>
    </Card>
  );
};

export default IDEMRegisterForm;
