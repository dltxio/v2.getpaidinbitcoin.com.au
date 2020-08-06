import React from "react";
import "./Loader.scss";

const Loader = ({
  loading,
  children,
  noBackground,
  diameter = "1.5rem",
  noStretch,
  light,
  className,
  style: _style = {}
}) => {
  if (!loading) return children || null;
  let classes = "loader";
  if (className) classes += ` ${className}`;

  const style = {
    width: diameter,
    height: diameter,
    borderColor: light ? "rgba(100, 100, 100, 0.2)" : "rgba(0, 0, 0, 0.6)",
    borderTopColor: light ? "rgba(250, 250, 250, 0.5)" : "rgba(0, 0, 0, 0.2)"
  };
  return (
    <div style={{ display: noStretch ? "inline-block" : undefined, ..._style }}>
      <div
        className={classes}
        style={{
          backgroundColor: noBackground ? "rgba(0,0,0,0)" : undefined,
          position: noStretch ? "" : "absolute"
        }}
      >
        <div style={style} />
      </div>
      {children}
    </div>
  );
};

export default Loader;
