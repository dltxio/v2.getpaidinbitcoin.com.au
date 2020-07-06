import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import "./Layout.scss";

const Layout = ({
  header,
  footer,
  children,
  noFooter,
  noHeader,
  activeTab,
  navLinks,
  ...props
}) => (
  <>
    <header>
      {noHeader || header || <Nav activeTab={activeTab} links={navLinks} />}
    </header>
    <main {...props}>{children}</main>
    <footer>{noFooter || footer || <Footer />}</footer>
  </>
);

export default Layout;
