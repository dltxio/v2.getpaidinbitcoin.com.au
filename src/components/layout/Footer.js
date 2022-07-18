import React from "react";
import FooterPanel from "./FooterPanel";
import "./Footer.scss";
const panels = [
  {
    heading: "About",
    className: "col-sm-6 col-md-4",
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
    className: "col-sm-6 col-md-4",

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
            href="http://keys.gnupg.net/pks/lookup?search=info%40getpaidinbitcoin.com.au&fingerprint=on&op=index"
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
    className: "col-sm-12 col-md-4",

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

const Footer = () => (
  <div className="footer">
    <div className="row">
      {panels.map((panel, i) => (
        <FooterPanel key={i} panel={panel} />
      ))}
    </div>
    <div className="copyright">
      Copyright © 2022 Bitcoin Brisbane, DLTx & Get Paid in Bitcoin.
    </div>
  </div>
);

export default Footer;
