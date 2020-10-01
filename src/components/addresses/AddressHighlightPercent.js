import React from "react";
import AddressHover from "./AddressHover";
import "./AddressHighlightPercent.scss";

const AddressHighlightPercent = ({
  address,
  max,
  hoverProps = {},
  className,
  ...props
}) => {
  let classes = "address-highlight-percent";
  if (className) classes += ` ${className}`;
  const width = `${(100 * address.total) / max}%`;
  return (
    <div className={classes} {...props}>
      <AddressHover address={address} {...hoverProps} />
      <div
        className={`highlight${address.deleted ? " archived" : ""}`}
        style={{ width }}
      />
    </div>
  );
};

export default AddressHighlightPercent;
