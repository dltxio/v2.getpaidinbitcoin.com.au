import React from "react";
import LabelledTable from "components/LabelledTable";
import AddressHighlightPercent from "components/addresses/AddressHighlightPercent";
import "./AddressTotals.scss";

const getAddresses = (active, archived, totals) => {
  return [...active, ...archived]
    .map((a) => ({
      total: totals[a.address1] || 0,
      ...a
    }))
    .sort((a, b) => b.total - a.total);
};

const AddressTotals = ({
  active = [],
  archived = [],
  totals = {},
  className,
  ...props
}) => {
  const addresses = getAddresses(active, archived, totals);
  const max = addresses[0]?.total;

  let classes = "address-totals";
  if (className) classes += ` ${className}`;

  const columns = addresses.reduce((columns, address) => {
    const label = (
      <AddressHighlightPercent
        address={address}
        max={max}
        hoverProps={{ style: { padding: "0.8rem" } }}
      />
    );
    const config = {
      trProps: {
        className: address.deleted ? "archived" : undefined
      }
    };
    columns.push([label, address.total, config]);
    return columns;
  }, []);

  return (
    <div className={classes} {...props}>
      <LabelledTable
        columns={columns}
        hover={false}
        style={{ tableLayout: "fixed" }}
      />
    </div>
  );
};

export default AddressTotals;
