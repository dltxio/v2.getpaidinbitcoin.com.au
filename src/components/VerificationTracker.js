import React from "react";
import "./VerificationTracker.scss";

const statuses = {
  "0": {
    label: "Registered",
    onClick: () => {},
    icon: "person-outline"
  },
  "1": {
    label: "Add BTC Address",
    onClick: () => {},
    icon: "logo-bitcoin"
  },
  "2": {
    label: "Verify Email",
    onClick: () => {},
    icon: "mail-outline"
  },
  "3": {
    label: "Verify Mobile",
    onClick: () => {},
    icon: "phone-portrait-outline"
  },
  "4": {
    label: "Verify ID",
    onClick: () => {},
    icon: "newspaper-outline"
  },
  "5": {
    label: "Add Payroll Information",
    onClick: () => {},
    icon: "cash-outline"
  },
  "6": {
    label: "Completed",
    onClick: () => {},
    icon: "checkmark-circle-outline"
  }
};

const VerificationTracker = ({ status = -1 }) => {
  status = parseInt(status);
  const activeStep = statuses[status + 1] || {};

  const renderBlob = (key, i) => {
    const { label, onClick, icon } = statuses[key] || {};
    const isLastBlob = i === Object.keys(statuses).length - 1;
    const isCurrentStep = parseInt(key) === status + 1;

    // Default classnames
    let classes = "stage";
    let lineClasses = "line";

    // Add compelted class
    if (parseInt(key) <= status) {
      classes += " completed";
      lineClasses += " completed";
    }

    // Add active class to next status
    if (isCurrentStep) classes += " active";

    return (
      <React.Fragment key={key}>
        <div className="blob" onClick={isCurrentStep ? onClick : undefined}>
          <div className={classes} title={label}>
            <ion-icon name={icon} />
          </div>
          <span className="label">{label}</span>
        </div>
        {!isLastBlob && <div className={lineClasses} />}
      </React.Fragment>
    );
  };

  return (
    <div className="verification-tracker">
      <div className="label text-center">
        <h3>{activeStep.label}</h3>
      </div>
      <div className="blobs">{Object.keys(statuses).map(renderBlob)}</div>
    </div>
  );
};

export default VerificationTracker;
