// import React, { useEffect, useRef, useState } from "react";
import React from "react";
import { useField } from "formik";
import ErrorMessage from "components/ErrorMessage";

const FormGroupWrap = ({ isWrapped, children }) =>
  isWrapped ? <div className="form-group">{children}</div> : <>{children}</>;

const Selector = ({
  label,
  onChange,
  skinny,
  options,
  currentSelection,
  ...props
}) => {
  let [field, meta] = useField(props);

  if (onChange) field.onChange = (e) => onChange(e.target.value);

  return (
    <FormGroupWrap isWrapped={!skinny}>
      {label && <label>{label}</label>}

      <select className="form-control mb-1" {...props} {...field}>
        {options.map(([value, label]) => {
          return <option value={value}>{label}</option>;
        })}
      </select>

      <ErrorMessage error={meta.error} isHidden={!meta.touched} />
    </FormGroupWrap>
  );
};

export default Selector;
