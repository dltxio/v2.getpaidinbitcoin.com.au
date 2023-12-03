import React from "react";
import "./Toggle.scss";

/**
 * Toggle
 * Can replace checkbox.
 * Resources:
 *  - [Formik](https://formik.org/docs/tutorial#wrapping-up)
 *  - [Codesandbox](https://codesandbox.io/p/sandbox/formik-v2-tutorial-final-ge1pt?file=%2Fsrc%2Findex.js%3A29%2C33)
 */
const Toggle = ({ value, setValue, className, ...props }) => {
  // const [field, meta, helpers] = useField(props);  // this line is needed for additional logic
  const toggleValue = () => setValue(!value);
  let classes = "toggle form-group";
  if (className) classes += ` ${className}`;

  return (
    <div className={classes}>
      <div className={`switch ${value ? "checked" : ""}`} onClick={toggleValue}>
        <input type="checkbox" {...props} />
        <span className="slider" />
      </div>
    </div>
  );
};

export default Toggle;
