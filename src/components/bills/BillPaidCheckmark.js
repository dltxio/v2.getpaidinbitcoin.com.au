import React from "react";
import Checkmark from "components/Checkmark";

const BillPaidCheckMark = () => (
  <div className="content m-auto">
    <Checkmark />
    <p className="text-center">Your bitcoin has been received.</p>
  </div>
);

export default BillPaidCheckMark;
