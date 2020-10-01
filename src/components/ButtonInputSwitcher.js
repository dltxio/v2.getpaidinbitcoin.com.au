import React, { useState, useRef } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";

const ButtonInputSwitcher = ({
  onSubmit,
  submitText,
  confirmText = "Submit",
  onCancel,
  ...props
}) => {
  const [isInputShown, setInputShown] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputEl = useRef(null);

  const handleClick = () => {
    if (!isInputShown) setInputShown(true);
    setTimeout(() => inputEl.current.focus(), 0);
  };

  const handleSubmit = (e) => {
    if (e.type === "submit") e.preventDefault();
    const actions = {
      setInputShown,
      setInputValue
    };
    onSubmit(inputValue, actions);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setInputShown(false);
  };

  const renderChildren = () => {
    if (!isInputShown) return submitText;
    return (
      <form onSubmit={handleSubmit}>
        <input
          className="form-control"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          ref={inputEl}
        />
      </form>
    );
  };
  const renderActions = () => {
    return !isInputShown ? null : (
      <ButtonGroup className="mb-2">
        <Button onClick={handleSubmit}>{confirmText}</Button>
        <Button onClick={handleCancel}>
          <ion-icon name="close-outline" />
        </Button>
      </ButtonGroup>
    );
  };

  return (
    <div className="d-flex justify-content-start align-items-center">
      <SubmitSpinnerButton
        submitText={renderChildren()}
        onClick={handleClick}
        {...props}
      />
      {renderActions()}
    </div>
  );
};

export default ButtonInputSwitcher;
