import Link from "next/link";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";
import { FacebookIcon } from "@/components/ui/Icons";
import { FOOTER_LINKS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer>
      <div className="wc-footer-main">
        <div className="wc-row">
          <div className="wc-footer-cols">
            <section className="wc-col" aria-labelledby="footer-about">
              <h2 id="footer-about">About</h2>
              <p>
                Western Cars was formed in {SITE.foundingYear} to provide the best private hire service in Crawley, Taxi in Gatwick, covering Gatwick, Taxi to brighton, Cheap taxi to brighton, Haywards Heath and
                suburbs, Heathrow and all the other airports.
              </p>
            </section>
            <nav className="wc-col" aria-labelledby="footer-links">
              <h2 id="footer-links">Links</h2>
              <ul>
                {FOOTER_LINKS.map((l) => (
                  <li key={l.label}>
                    {"external" in l && l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <section className="wc-col" aria-labelledby="footer-contact">
              <h2 id="footer-contact">Contact</h2>
              <address style={{ fontStyle: "normal" }}>
                <p>{SITE.address.oneLine}</p>
                <p>
                  T: <a href={SITE.phone.tel}>{SITE.phone.display}</a>
                  <br />
                  E: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </p>
              </address>
            </section>
            <div className="wc-col">
              <iframe src={SITE.maps.embed} title="Map showing the Western Cars Crawley office" width="600" height="250" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </div>
      <div className="wc-footer-legal">
        <div className="wc-footer-legal__row">
          <div>
            <p>
              © Copyright 2021 – {SITE.legalName}. Registered Company in {SITE.companyRegisteredIn} No: {SITE.companyNumber}
            </p>
          </div>
          <div>
            <a className="wc-social" href={SITE.links.facebook} target="_blank" rel="noopener noreferrer" title="Follow on Facebook">
              <FacebookIcon />
              <span className="sr-only">Follow Western Cars on Facebook (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <div className="wc-footer-credit">
          <p>
            <a href={SITE.links.siteBuilder} target="_blank" rel="noopener noreferrer">
              Site by Blink Web Ltd
            </a>
            {" · "}
            <CookieSettingsButton />
          </p>
        </div>
      </div>
    </footer>
  );
}
