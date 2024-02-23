import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { AuthContext } from "components/auth/Auth";
import logo from "./gpib-logo.png";
import "./Nav.scss";

const _Nav = ({ links, noBrand = false, activeTab }) => {
  let { logout, user, isVerified } = useContext(AuthContext);
  const history = useHistory();
  // Set default links

  const loginLink = user
    ? { label: "Log Out", onClick: logout }
    : { label: "Log in", onClick: () => history.push("/login") };

  if (isVerified === undefined)
    isVerified = user.emailVerified && user.idVerificationStatus === 3;
  
  const verifiedOnlyLinks = !isVerified
    ? []
    : [
        {
          label: "Dashboard",
          onClick: () => history.push("/")
        },
        {
          label: "Addresses",
          onClick: () => history.push("/addresses")
        },
        {
          label: "Profile",
          onClick: () => history.push("/profile"),
          name: "profile"
        },
        {
          label: "Contact Support",
          onClick: () => history.push("/contactsupport")
        }
      ];

  if (!links) {
    links = [...verifiedOnlyLinks, loginLink];
  }

  // For a dropdown menu item, add an object like this to the links array
  // {
  //   label: "Dropdown",
  //   children: [
  //     { type: "Item", label: "Action 1", onClick: () => console.log("action") },
  //     { type: "Item", label: "Action 2", onClick: () => console.log("action") },
  //     { type: "Divider" },
  //     { type: "Item", label: "Action 3", onClick: () => console.log("action") }
  //   ]
  // }

  const renderBrand = () => (
    <Navbar.Brand
      style={{ cursor: "pointer" }}
      onClick={() => history.push("/")}
    >
      <img className="GPIBLogo" src={logo} alt="Get Paid In Bitcoin" />
    </Navbar.Brand>
  );

  const renderLinks = () => (
    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
      <Nav>
        {links.map(({ label, onClick, children, name }, i) => {
          const isActiveTab = activeTab === label || activeTab === String(name);
          const classes = isActiveTab ? "active" : "";
          return !children ? (
            <Nav.Link onClick={onClick} key={i} className={classes}>
              <div className="d-flex align-items-center justify-content-center">
                {label}
              </div>
            </Nav.Link>
          ) : (
            <NavDropdown title={label} key={i} className={classes}>
              {children.map((c, ind) => {
                const Item = NavDropdown[c.type];
                return (
                  <Item onClick={c.onClick} key={ind} children={c.label} />
                );
              })}
            </NavDropdown>
          );
        })}
      </Nav>
    </Navbar.Collapse>
  );
  return (
    <Navbar bg="light" expand="lg">
      {!noBrand && renderBrand()}
      {!links.length || <Navbar.Toggle aria-controls="basic-navbar-nav" />}
      {!links.length || renderLinks()}
    </Navbar>
  );
};

export default _Nav;
