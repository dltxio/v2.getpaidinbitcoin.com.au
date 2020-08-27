import React from "react";
import AddressHover from "./AddressHover";

const AddressTotals = ({ active = [], archived = [], totals = {} }) => {
  console.log(active);
  console.log(archived);
  console.log(totals);

  return (
    <div>
      {archived.map((a) => (
        <div>
          <AddressHover address={a} style={{ padding: "1rem" }} />
        </div>
      ))}
    </div>
  );
};

export default AddressTotals;
