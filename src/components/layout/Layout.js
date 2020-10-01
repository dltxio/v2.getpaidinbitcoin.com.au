import React from "react";
import Nav from "components/layout/Nav";
import Footer from "components/layout/Footer";
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
