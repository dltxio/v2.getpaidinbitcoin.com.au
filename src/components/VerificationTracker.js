import React from "react";
import "./VerificationTracker.scss";

const statuses = {
  "0": "Registered",
  "1": "Initial Deposit",
  "2": "SMS Verification",
  "3": "KYC Completed",
  "4": "OB Completed"
};
const VerificationTracker = ({ status = -1 }) => (
  <div className="verification-tracker">
    <div className="label text-center">
      <h3>{statuses[status]}</h3>
    </div>
    <div className="blobs">
      {Object.keys(statuses).map((key, i) => {
        let classes = "stage";
        let lineClasses = "line";
        if (parseInt(key) < status) {
          classes += " completed";
          lineClasses += " completed";
        }
        if (parseInt(key) === status) classes += " active";

        return (
          <React.Fragment key={key}>
            <div className={classes} title={statuses[key]}>
              <span>{statuses[key]}</span>
            </div>
            {i !== Object.keys(statuses).length - 1 && (
              <div className={lineClasses} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

export default VerificationTracker;
