import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * "Western Cars at a glance" — the key business facts as plain, crawlable HTML (a definition list)
 * so search engines and AI assistants can lift them directly. Every fact is published elsewhere on
 * the original site (footer, About, Our Services, T&Cs).
 */
export function QuickFacts() {
  return (
    <section className="wc-section" aria-labelledby="facts-heading" style={{ paddingTop: 0 }}>
      <div className="wc-row">
        <h2 id="facts-heading">Western Cars at a glance</h2>
        <dl className="wc-facts">
          <dt>Who we are</dt>
          <dd>
            Western Cars Crawley is a private hire taxi company run by {SITE.legalName}, registered in {SITE.companyRegisteredIn} (company no. {SITE.companyNumber}). The company was formed in {SITE.foundingYear}.
          </dd>
          <dt>Address</dt>
          <dd>
            <address style={{ fontStyle: "normal" }}>{SITE.address.oneLine}</address>
          </dd>
          <dt>Telephone</dt>
          <dd>
            <a href={SITE.phone.tel}>{SITE.phone.display}</a>
          </dd>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </dd>
          <dt>Opening hours</dt>
          <dd>{SITE.hours.label}</dd>
          <dt>Services</dt>
          <dd>
            Airport transfers, private taxi hire, group travel by MPV and minibus, chauffeur (VIP) service on request, and business accounts — see <Link href="/our-services/">Our Services</Link>.
          </dd>
          <dt>Where we operate</dt>
          <dd>
            Crawley, East and West Sussex and all major train stations, including <Link href="/taxi-service-in-east-grinstead/">East Grinstead</Link>, <Link href="/haywards-heath-taxi/">Haywards Heath</Link>,{" "}
            <Link href="/horsham-taxi/">Horsham</Link>, <Link href="/worthing-taxi/">Worthing</Link> and <Link href="/chichester-taxi/">Chichester</Link>.
          </dd>
          <dt>Airports served</dt>
          <dd>
            <Link href="/gatwick-taxi/">Gatwick</Link>, <Link href="/heathrow-taxi/">Heathrow</Link>, <Link href="/stansted-taxi/">Stansted</Link>, <Link href="/airport-taxi-luton/">Luton</Link>,{" "}
            <Link href="/airport-taxi-london-city/">London City</Link>, <Link href="/airport-taxi-southend/">Southend</Link> and <Link href="/airport-taxi-biggin-hill/">Biggin Hill</Link>.
          </dd>
          <dt>How to book</dt>
          <dd>
            Online through our <a href={SITE.links.booking} target="_blank" rel="noopener noreferrer">booking page</a>, by phone, by text, by email, or with the free iPhone and Android app.
          </dd>
        </dl>
      </div>
    </section>
  );
}
