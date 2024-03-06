import React from "react";
import { Button } from "react-bootstrap";

const ModalHeader = ({ heading, onDismiss, noExit }) => {
  return (
    <div
      className={
        heading
          ? "modal-header align-items-center justify-content-between"
          : "container-fluid p-2"
      }
    >
      {heading && <h5 className="modal-title">{heading}</h5>}
      {!noExit && (
        <Button
          type="button"
          className="close"
          aria-label="Close"
          onClick={onDismiss}
        >
          <span aria-hidden="true">&times;</span>
        </Button>
      )}
    </div>
  );
};
export default ModalHeader;
