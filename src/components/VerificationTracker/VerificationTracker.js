import React, { useEffect, useContext } from "react";
import Card from "../Card";
import VerifyEmail from "./VerifyEmail";
import VerifyMobile from "./VerifyMobile";
import AddPayroll from "./AddPayroll";
import VerifyID from "./VerifyID";
import { AuthContext } from "components/auth/Auth";
import "./VerificationTracker.scss";

const VerificationTracker = ({ userDetails, depositHints, userEnterprise }) => {
  const { isVerified, hasVerified, setHasVerified, setVerified } = useContext(
    AuthContext
  );
  const { emailVerified, mobileVerified, idVerificationStatus } =
    userDetails || {};
  const { depositAmount } = depositHints || {};
  const { name: employerName } = userEnterprise || {};

  useEffect(() => {
    const isVerified =
      emailVerified &&
      mobileVerified &&
      depositAmount !== undefined &&
      (employerName || idVerificationStatus === 3);
    setVerified(isVerified);
  }, [
    emailVerified,
    mobileVerified,
    depositAmount,
    employerName,
    idVerificationStatus,
    setVerified
  ]);

  useEffect(() => {
    const hasVerified = userDetails && depositHints && userEnterprise;
    setHasVerified(hasVerified);
  }, [depositHints, userDetails, userEnterprise, setHasVerified]);

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
      panel: <VerifyEmail />
    },
    {
      label: "Verify Mobile",
      icon: "phone-portrait-outline",
      isCompleted: userDetails?.mobileVerified,
      panel: <VerifyMobile />
    },
    {
      label: "Add Payroll Information",
      icon: "cash-outline",
      isCompleted: depositHints?.depositAmount !== undefined,
      panel: <AddPayroll userEnterprise={userEnterprise} />
    }
  ];
  if (!employerName) {
    steps.push({
      label: "Verify ID",
      icon: "newspaper-outline",
      panel: <VerifyID />,
      isCompleted: userDetails?.idVerificationstatus === 3
    });
  } else {
    steps.splice(2, 1);
  }

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

  if (isVerified || !hasVerified || !activeStep) return null;
  return (
    <div className="verification-tracker">
      <Card>
        <div className="py-5">
          <div className="blobs">{steps.map(renderBlob)}</div>
          {activeStep.panel && (
            <div
              style={{ maxWidth: "50rem", margin: "auto" }}
              className="mt-4 py-5"
            >
              {activeStep.panel}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VerificationTracker;
