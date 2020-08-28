import React from "react";
import "./AddressHover.scss";

const AddressHover = ({ address, className, ...props }) => {
  let classes = "address-hover";
  if (className) classes += ` ${className}`;
  const renderChildren = () => {
    if (!address.label)
      return (
        <div>
          <span>{address.address1}</span>
        </div>
      );
    return (
      <div>
        <span className="address">{address.address1}</span>
        <span className="label">{address.label}</span>
      </div>
    );
  };
  return (
    <div className={classes} {...props}>
      {renderChildren()}
    </div>
  );
};

export default AddressHover;
