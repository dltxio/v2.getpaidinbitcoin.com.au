import React from "react";
import { RadialChart } from "react-vis";
const AddressPie = ({ addresses = [], ...props }) => {
  const data = addresses.slice(0, 2).map((a) => ({
    angle: a.percent,
    label: `${a.address1.slice(0, 4)}...${a.address1.slice(-4)}`
  }));
  return (
    <RadialChart data={data} showLabels height={300} width={300} {...props} />
  );
};

export default AddressPie;
