import QRCode from "qrcode.react";
import React from "react";

const IdemQRCode = () => {
  return (
    <div>
      <QRCode id="IdemQRCode" value="idem://exchange/vendors/1" />
    </div>
  );
};

export default IdemQRCode;
