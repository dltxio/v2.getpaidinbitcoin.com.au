import React from "react";
import AddressHover from "./AddressHover";
import "./AddressPercentBar.scss";

const AddressPercentBar = ({ addresses = [], className, ...props }) => {
  const total = addresses.reduce((sum, item) => sum + item.percent, 0);

  let classes = "address-percent-bar";
  if (className) classes += ` ${className}`;

  const hasMultipleAddresses = addresses.length > 1;

  const renderAddress = (address) => {
    const width = `${(100 * address.percent) / total}%`;
    return (
      <div className="address-container" key={address.id} style={{ width }}>
        <AddressHover address={address} style={{ padding: "1rem" }} />
        {hasMultipleAddresses && (
          <div className="percentages">
            <div>{address.percent}%</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={classes} {...props}>
      {addresses.sort((a, b) => b.percent - a.percent).map(renderAddress)}
    </div>
  );
};

export default AddressPercentBar;
