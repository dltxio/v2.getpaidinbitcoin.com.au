import React, { useEffect, useContext } from "react";
import Card from "../Card";
import VerifyEmail from "./VerifyEmail";
// import AddPayroll from "./AddPayroll";
// import VerifyID from "./VerifyID";
import { AuthContext } from "components/auth/Auth";
import "./VerificationTracker.scss";
// import AddAddress from "./AddAddress";

const VerificationTracker = ({
  userDetails,
  depositHints,
  userEnterprise,
  userAddress
}) => {
  const { isVerified, setVerified } = useContext(AuthContext);

  useEffect(() => {
    const verified =
      userDetails && depositHints && userEnterprise && userAddress;
    setVerified(verified);
  }, [depositHints, userDetails, userEnterprise, setVerified, userAddress]);

  const steps = [
    {
      label: "Registered",
      icon: "person-outline",
      isCompleted: true
    },
    {
      label: "Verify Email",
      icon: "mail-outline",
      isCompleted: userDetails?.emailVerified,
      panel: <VerifyEmail userDetails={userDetails} />
    }
    // {
    //   label: "Add Payroll Information",
    //   icon: "cash-outline",
    //   isCompleted: depositHints?.depositAmount !== undefined,
    //   panel: <AddPayroll userEnterprise={userEnterprise} />
    // },
    // {
    //   label: "Add BTC Address",
    //   icon: "logo-bitcoin",
    //   isCompleted: userAddress && userAddress.length > 0,
    //   panel: <AddAddress userEnterprise={userEnterprise} />
    // },
    // {
    //   label: "Verify ID",
    //   icon: "newspaper-outline",
    //   panel: <VerifyID />,
    //   isCompleted: userDetails?.idVerificationstatus === 3
    // }
  ];

  const activeStepIndex = steps.map((v) => v.isCompleted).indexOf(false);
  const activeStep = steps[activeStepIndex];

  const renderBlob = (step, i) => {
    const isLastBlob = i === Object.keys(steps).length - 1;
    const { label, icon } = step;
    const isCompleted = i < activeStepIndex;
    let classes = "stage";
    let lineClasses = "line";
    if (isCompleted) {
      classes += " completed";
      lineClasses += " completed";
    }
    if (i === activeStepIndex) classes += " active";

    return (
      <React.Fragment key={i}>
        <div className="blob">
          <div className={classes} title={label}>
            <ion-icon name={isCompleted ? "checkmark-circle-outline" : icon} />
          </div>
          <span className="label">{label}</span>
        </div>
        {!isLastBlob && <div className={lineClasses} />}
      </React.Fragment>
    );
  };

  // if (isVerified || !hasVerified || !activeStep) return null;
  if (isVerified || !activeStep) return null;

  return (
    <div className="verification-tracker">
      <Card>
        <div className="py-5">
          <div className="blobs">{steps.map(renderBlob)}</div>
          {activeStep.panel && (
            <div style={{ maxWidth: "50rem", margin: "auto" }} className="my-4">
              {activeStep.panel}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VerificationTracker;
