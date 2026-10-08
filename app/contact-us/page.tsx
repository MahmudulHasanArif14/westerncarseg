import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageBanner } from "@/components/sections/PageBanner";
import { WhyChooseUsBand } from "@/components/sections/WhyChooseUs";
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/schemas";
import { BgImage } from "@/components/ui/BgImage";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { INNER_PAGES } from "@/lib/inner-pages";
import { createPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

const { path, seo, modified } = INNER_PAGES["contact-us"];
export const metadata: Metadata = createPageMetadata({ title: seo.title, description: seo.description, path });

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Contact Us", path: path },
];

export default function ContactPage() {
  return (
    <>
      <PageBanner h1="Contact Us" crumbs={CRUMBS} />

      <section className="wc-section wc-contact" aria-label="Contact form">
        <div className="wc-row wc-row--flush">
          <div className="wc-contact__grid">
            <div className="wc-contact__photo">
              <BgImage file="Contact-Us.jpg" sizes="(min-width: 981px) 432px, 100vw" quality={65} />
            </div>
            <ContactForm />
          </div>
        </div>
        <div className="wc-row">
          <ul className="wc-cols wc-contact-blurbs" aria-label="Contact details">
            <li className="wc-col wc-col--1-3">
              <PinIcon />
              <address style={{ fontStyle: "normal" }}>{SITE.address.oneLine}</address>
            </li>
            <li className="wc-col wc-col--1-3">
              <PhoneIcon />
              <a href={SITE.phone.tel}>{SITE.phone.display}</a>
            </li>
            <li className="wc-col wc-col--1-3">
              <MailIcon />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
          </ul>
        </div>
      </section>

      <WhyChooseUsBand />

      <WebPageSchema path={path} name={seo.title} description={seo.description} modified={modified} type="ContactPage" />
      <BreadcrumbSchema path={path} crumbs={CRUMBS} />
    </>
  );
}
