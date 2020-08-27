import React from "react";
import "./AddressHover.scss";

const AddressHover = ({ address, className, ...props }) => {
  let classes = "address-hover";
  if (className) classes += ` ${className}`;
  return (
    <div className={classes} {...props}>
      <span className="address">{address.address1}</span>
      <span className="label">{address.label}</span>
    </div>
  );
};

export default AddressHover;
