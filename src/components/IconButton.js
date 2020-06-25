import React from "react";
import { Button } from "react-bootstrap";

const IconButton = ({ icon, children, ...props }) => (
  <Button style={{ minWidth: 36, minHeight: 38 }} {...props}>
    <div className="d-flex align-items-center justify-content-center">
      <ion-icon name={icon} />
      {children}
    </div>
  </Button>
);

export default IconButton;
