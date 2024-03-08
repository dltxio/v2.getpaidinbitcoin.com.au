import React from "react";
import "./ToggleButton.scss";
import { useField } from "formik";

/**
 * ToggleButton
 * with better UI, can replace checkbox.
 * Resources:
 *  - [Formik](https://formik.org/docs/tutorial#wrapping-up)
 *  - [Codesandbox](https://codesandbox.io/p/sandbox/formik-v2-tutorial-final-ge1pt?file=%2Fsrc%2Findex.js%3A29%2C33)
 *  - [Styling](https://www.w3schools.com/howto/howto_css_switch.asp)
 */
const ToggleButton = ({ label, ...props }) => {
  const [field, _] = useField({ ...props, type: "checkbox" });

  const additionalClassName = " " + props.className;

  {/*<div className="toggle-button">*/}
  return (
    <>
      {label && <div className="toggle-button"><label>{label}</label></div>} 
      <label className={"toggle-button switch" + additionalClassName}>
        <input type="checkbox" {...field} {...props} />
        <span className="slider round"></span>
      </label>
    </>
  );
};
{/* // </div> */}

export default ToggleButton;
