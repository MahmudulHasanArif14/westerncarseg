import type { Metadata } from "next";
import Link from "next/link";
import { AreasCovered } from "@/components/sections/AreasCovered";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageBanner } from "@/components/sections/PageBanner";
import { WhyChooseUsBand } from "@/components/sections/WhyChooseUs";
import { BreadcrumbSchema, FAQSchema, ServiceSchema, WebPageSchema } from "@/components/seo/schemas";
import { BgImage } from "@/components/ui/BgImage";
import { CheckIcon } from "@/components/ui/Icons";
import { RichText } from "@/components/ui/RichText";
import { ALL_AREAS } from "@/lib/areas";
import { SERVICES_FAQ } from "@/lib/faq";
import { INNER_PAGES } from "@/lib/inner-pages";
import { createPageMetadata } from "@/lib/seo";
import type { ReactNode } from "react";

const { path, seo, modified } = INNER_PAGES["our-services"];
export const metadata: Metadata = createPageMetadata({ title: seo.title, description: seo.description, path });

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Our Services", path: path },
];

const HIGHLIGHTS = ["Airport Transfer", "Seaport Transfer", "Station Transfer", "University Links", "City Touring"];

interface ServiceRow {
  title: string;
  photo: string;
  photoFirst: boolean;
  body: ReactNode;
}

const ROWS: ServiceRow[] = [
  {
    title: "Airport Transfers",
    photo: "Airport-Transfer-Pickup-Taxi.jpg",
    photoFirst: true,
    body: (
      <p>
        Our services include dropping/picking from all major airports to your desired destinations including <Link href="/gatwick-taxi/">Gatwick</Link>, <Link href="/heathrow-taxi/">Heathrow</Link>,{" "}
        <Link href="/stansted-taxi/">Stansted</Link> and any major airports all over the UK. We also offer a Meet and Greet service if required. The driver will be waiting at arrivals with a name board. Our
        controllers will keep an eye on your flight so we are always on time.
      </p>
    ),
  },
  {
    title: "Private Taxi Hire",
    photo: "Western-Cars-Crawley-Taxi-Service.jpg",
    photoFirst: false,
    body: <p>Covering East and West Sussex, all major train stations and of course anywhere else you may wish to travel to all around the UK.</p>,
  },
  {
    title: "Groups",
    photo: "Chauffering-Hire.jpg",
    photoFirst: true,
    body: <p>We are proud to provide transportation for big groups whether you are going on a city tour or a wedding destination or any other event due to our availability of mpv’s and minibuses at your service.</p>,
  },
  {
    title: "VIP Service",
    photo: "VIP-Taxi-Service.jpg",
    photoFirst: false,
    body: (
      <p>
        Chaffeuring is also available upon request. Please do not hesitate to contact via our number on <a href="tel:+441293300000">01293 300000</a>.
      </p>
    ),
  },
  {
    title: "Business Accounts",
    photo: "Business-Accounts.jpg",
    photoFirst: true,
    body: (
      <>
        <p>Western cars offers an account service for corporate and individuals. Along with our large number of fleet available for the services, we have also equipped with many executive cars for our business customers.</p>
        <p>There are many benefits to opening an account with western cars:</p>
        <ul>
          <li>Priority status over cash paying customers</li>
          <li>Monthly Invoicing</li>
          <li>15 to 30 days credit facility</li>
          <li>Full explanation of your bookings</li>
          <li>No need to carry cash with you</li>
          <li>Journeys have a fixed pick-up to drop-off price, regardless of route or time taken</li>
        </ul>
        <p>
          For further details on setting up an account, or for more information on our rates, please contact us on <a href="tel:+441342300000">01342 300 000</a> or email us on{" "}
          <a href="mailto:info@westerncars.co.uk">info@westerncars.co.uk</a>
        </p>
      </>
    ),
  },
];

const AREA_COLUMNS = [
  ["Crawley", "East Grinstead", "Burgess Hill", "Haywards Heath", "Hassocks", "Ardingly", "Henfield", "Lewes", "Steyning", "Worthing"],
  ["Horsham", "Copthorne", "Southwater", "Billingshurst", "Arundel", "Chichester", "Petworth", "Midhurst", "Littlehampton", "Bognor Regis"],
  ["Horley", "Gatwick", "Heathrow", "Stansted", "Luton", "London City", "Southend", "Biggin Hill"],
];

export default function OurServicesPage() {
  return (
    <>
      <PageBanner h1="Our Services" crumbs={CRUMBS} />

      <section className="wc-section wc-services-intro" aria-label="Our services at a glance">
        <div className="wc-row">
          <RichText html="<p>Western Cars services are delivered through our fleet of modern saloon, six seaters MPV’s, executive cars catering for all immediate daily transportation requirements. You’re local taxi company in Crawley.</p>" />
        </div>
        <div className="wc-row" style={{ paddingTop: 15 }}>
          <ul className="wc-service-list">
            {HIGHLIGHTS.map((h) => (
              <li key={h}>
                <CheckIcon />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wc-section wc-services-body" aria-label="Service details">
        {ROWS.map((row) => (
          <div key={row.title} className={`wc-row wc-service-row${row.photoFirst ? " wc-service-row--photo-first" : ""}`}>
            {row.photoFirst ? (
              <>
                <div className="wc-col wc-service-photo">
                  <BgImage file={row.photo} sizes="(max-width: 980px) 100vw, 540px" quality={65} />
                </div>
                <div className="wc-col wc-service-text">
                  <h2>{row.title}</h2>
                  {row.body}
                </div>
              </>
            ) : (
              <>
                <div className="wc-col wc-service-text">
                  <h2>{row.title}</h2>
                  {row.body}
                </div>
                <div className="wc-col wc-service-photo">
                  <BgImage file={row.photo} sizes="(max-width: 980px) 100vw, 540px" quality={65} />
                </div>
              </>
            )}
          </div>
        ))}
      </section>

      <section className="wc-section" aria-label="Frequently asked questions" style={{ paddingTop: 0 }}>
        <div className="wc-row">
          <FaqSection items={SERVICES_FAQ} id="services-faq" />
        </div>
      </section>

      <section className="wc-section" aria-label="Areas we cover" style={{ paddingTop: 0 }}>
        <AreasCovered columns={AREA_COLUMNS} currentPath={path} id="services-areas" />
      </section>

      <WhyChooseUsBand />

      <WebPageSchema path={path} name={seo.title} description={seo.description} modified={modified} />
      <BreadcrumbSchema path={path} crumbs={CRUMBS} />
      <ServiceSchema
        path={path}
        name="Western Cars taxi and private hire services"
        serviceTypes={["Airport transfer", "Seaport transfer", "Station transfer", "University links", "City touring", "Private taxi hire", "Group transport", "VIP chauffeur service", "Business accounts"]}
        areas={ALL_AREAS}
      />
      <FAQSchema path={path} items={SERVICES_FAQ} />
    </>
  );
}
