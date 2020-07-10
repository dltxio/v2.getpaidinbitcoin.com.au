import React from "react";
import "./Card.scss";

const Card = ({ children, className, ...props }) => {
  let classes = "card";
  if (className) classes += ` ${className}`;
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
