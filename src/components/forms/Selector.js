import React from "react";
import { useField } from "formik";
import ErrorMessage from "components/ErrorMessage";

const FormGroupWrap = ({ isWrapped, children }) =>
  isWrapped ? <div className="form-group">{children}</div> : <>{children}</>;

const Selector = ({ label, onChange, skinny, options, ...props }) => {
  let [field, meta] = useField(props);

  return (
    <FormGroupWrap isWrapped={!skinny}>
      {label && <label>{label}</label>}
      <select className="form-control" {...props} {...field}>
        {options.map(([value, label]) => {
          return (
            <option key={String(value)} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      <ErrorMessage error={meta.error} isHidden={!meta.touched} />
    </FormGroupWrap>
  );
};

export default Selector;
