import React from "react";

const FooterItem = ({ item }) => {
  const { icon, text, jsx, link } = item;

  const renderContent = () => {
    if (jsx) return jsx;
    if (Array.isArray(text))
      return text.map((t, i) => <span key={i}>{t}</span>);
    if (link)
      return (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      );
    return text;
  };

  return (
    <div className="d-flex">
      {icon && (
        <span className="mr-3">
          <ion-icon name={icon} />
        </span>
      )}
      <span className="d-flex flex-column mb-2">{renderContent()}</span>
    </div>
  );
};

export default FooterItem;
