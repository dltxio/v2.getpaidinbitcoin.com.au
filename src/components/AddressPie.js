import React from "react";
import { RadialChart } from "react-vis";
const AddressPie = ({ addresses = [], ...props }) => {
  const data = addresses.map((a) => ({
    angle: a.percent,
    label: `${a.label} ${a.percent}%`
  }));
  return (
    <RadialChart data={data} showLabels height={300} width={300} {...props} />
  );
};

export default AddressPie;
