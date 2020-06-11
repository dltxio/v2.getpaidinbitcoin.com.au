import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";

const Layout = ({ header, footer, children, noFooter, noHeader }) => (
  <>
    <header>{noHeader || header || <Nav />}</header>
    <main>{children}</main>
    <footer>{noFooter || footer || <Footer />}</footer>
  </>
);

export default Layout;
