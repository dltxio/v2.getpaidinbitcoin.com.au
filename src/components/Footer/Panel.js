import React from "react";
import FooterItem from "./FooterItem";
import "./Panel.scss";

const Panel = ({ panel }) => {
  const { heading, items, className } = panel;
  return (
    <div className={className}>
      <div className="panel">
        <span className="heading">{heading}</span>
        <div>
          {items.map((item, i) => (
            <FooterItem key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Panel;
