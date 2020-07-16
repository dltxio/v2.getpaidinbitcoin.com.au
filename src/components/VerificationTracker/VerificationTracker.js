import React from "react";
import Card from "../Card";
import VerifyEmail from "./VerifyEmail";
import VerifyMobile from "./VerifyMobile";
import AddPayroll from "./AddPayroll";
import AddAddress from "./AddAddress";
import VerifyID from "./VerifyID";

import "./VerificationTracker.scss";

const VerificationTracker = ({ status = -1 }) => {
  status = parseInt(status);

  const statuses = {
    "0": {
      label: "Registered",
      onClick: () => {},
      icon: "person-outline"
    },
    "1": {
      label: "Verify Email",
      onClick: () => {},
      icon: "mail-outline",
      panel: <VerifyEmail />
    },
    "2": {
      label: "Verify Mobile",
      onClick: () => {},
      icon: "phone-portrait-outline",
      panel: <VerifyMobile />
    },
    "3": {
      label: "Add Payroll Information",
      onClick: () => {},
      icon: "cash-outline",
      panel: <AddPayroll />
    },
    "4": {
      label: "Add BTC Address",
      onClick: () => {},
      icon: "logo-bitcoin",
      panel: <AddAddress />
    },
    "5": {
      label: "Verify ID",
      onClick: () => {},
      icon: "newspaper-outline",
      panel: <VerifyID />
    },
    "6": {
      label: "Completed",
      onClick: () => {},
      icon: "checkmark-circle-outline"
    }
  };

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
      <Card>
        <div className="container py-5">
          <div className="blobs mb-4">
            {Object.keys(statuses).map(renderBlob)}
          </div>

          {activeStep.panel}
        </div>
      </Card>
    </div>
  );
};

export default VerificationTracker;
