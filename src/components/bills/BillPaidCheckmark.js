import React from "react";
import Checkmark from "components/Checkmark";

const BillPaidCheckMark = () => (
  <div className="content m-auto">
    <Checkmark />
    <p className="text-center">Your bill has been paid.</p>
  </div>
);

export default BillPaidCheckMark;
