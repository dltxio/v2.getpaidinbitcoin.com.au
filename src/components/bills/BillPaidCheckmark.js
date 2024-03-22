import React from "react";
import Checkmark from "components/Checkmark";

const BillPaidCheckMark = () => (
  <div className="content">
    <Checkmark />
    <p>Your bill has been paid.</p>
    <p>You can close this dialog.</p>
  </div>
);

export default BillPaidCheckMark;
