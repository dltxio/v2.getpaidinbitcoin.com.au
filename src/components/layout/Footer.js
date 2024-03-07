import React from "react";
import FooterPanel from "./FooterPanel";
import "./Footer.scss";

const panels = [
  {
    heading: "About",
    className: "col-md footer-panel",
    items: [
      { icon: "home", text: "PO Box 7675 Launceston TAS. 7250" },
      {
        icon: "briefcase",
        text: ["ABN 24 167 096 415", "ACN 167 096 415"]
      }
    ]
  },
  {
    heading: "Connect With Us",
    className: "col-md footer-panel",

    items: [
      {
        icon: "logo-facebook",
        text: "Facebook",
        link: "https://www.facebook.com/getpaidinbitcoin"
      },
      {
        icon: "logo-twitter",
        text: "Twitter",
        link: "https://www.twitter.com/paidinbitcoin"
      },
      {
        icon: "mail",
        text: "info@getpaidinbitcoin.com.au",
        link: "mailto:info@getpaidinbitcoin.com.au"
      },
      {
        icon: "lock-closed",
        jsx: (
          <a
            href="https://keys.openpgp.org/search?q=3DB82649E1E57F659E6D713DBF6860C234728E25"
            children="PGP PubKey (3DB82649)"
            download
          >
            PGP Public Key
          </a>
        )
      }
    ]
  },
  {
    heading: "Stay Updated",
    className: "col-md footer-panel",
    items: [
      {
        jsx: (
          <span>
            The official bitcointalk.org thread can be viewed at{" "}
            <a
              href="https://bitcointalk.org/index.php?topic=1294867.msg13292198"
              target="_blank"
              rel="noopener noreferrer"
            >
              bit.do/GPIB_BitcoinTalk
            </a>
          </span>
        )
      },
      {
        text: "Follow us on Twitter for all the latest news and features."
      }
    ]
  }
];

const currentYear = new Date().getFullYear();

const Footer = () => (
  <>
    <div className="container-fluid footer w-full">
      <div className="row">
        {panels.map((panel, i) => (
          <FooterPanel key={i} panel={panel} />
        ))}
      </div>
    </div>
    <div className="copyright">
      Copyright © {currentYear} Bitcoin Brisbane & Get Paid in Bitcoin.
    </div>
  </>
);

export default Footer;
