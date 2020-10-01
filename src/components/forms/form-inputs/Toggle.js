import React from "react";
import "./Toggle.scss";

const ToggleField = ({ value, setValue, className, ...props }) => {
  // const [field, meta, helpers] = useField(props);
  const toggleValue = () => setValue(!value);
  let classes = "toggle form-group";
  if (className) classes += ` ${className}`;
  return (
    <div className={classes}>
      <div
        className={`switch ${value ? "checked" : ""}`}
        onClick={toggleValue}
      >
        <input type="checkbox" {...props} />
        <span className="slider" />
      </div>
    </div>
  );
};

export default ToggleField;
