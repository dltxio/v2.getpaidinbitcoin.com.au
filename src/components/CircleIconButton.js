import React from "react";
import { Button } from "react-bootstrap";
import "./CircleIconButton.scss";
const CircleIconButton = ({ icon, className, ...props }) => {
  let classes = "circle-icon-button";
  if (className) classes += ` ${className}`;
  return (
    <Button type="button" className={classes} {...props}>
      <ion-icon name={icon} />
    </Button>
  );
};

export default CircleIconButton;
