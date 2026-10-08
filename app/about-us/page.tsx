import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageBanner } from "@/components/sections/PageBanner";
import { QuickFacts } from "@/components/sections/QuickFacts";
import { WhyChooseUsBand } from "@/components/sections/WhyChooseUs";
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/schemas";
import { image } from "@/lib/images";
import { INNER_PAGES } from "@/lib/inner-pages";
import { createPageMetadata } from "@/lib/seo";

const { path, seo, modified } = INNER_PAGES["about-us"];
export const metadata: Metadata = createPageMetadata({ title: seo.title, description: seo.description, path, ogImage: "About-Western-Cars-Taxi-Gatwick.jpg", ogImageAlt: "Western Cars Taxi Gatwick" });

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "About Us", path: path },
];

export default function AboutPage() {
  const photo = image("About-Western-Cars-Taxi-Gatwick.jpg");
  return (
    <>
      <PageBanner h1="About Us" subtitle="Local Crawley Taxi Service" crumbs={CRUMBS} />

      <section className="wc-section wc-about" aria-label="About Western Cars Crawley">
        <div className="wc-row">
          <div className="wc-about__grid">
            <div className="wc-about__photo">
              <Image src={photo.src} width={photo.width} height={photo.height} alt="Western Cars Taxi Gatwick" sizes="(max-width: 980px) 80vw, 510px" />
            </div>
            <div className="wc-about__card">
              <h2>About Western Cars Crawley</h2>
            </div>
            <div className="wc-about__body wc-about__text">
              <h3>Taxi Service Crawley</h3>
              <p>Need to book a taxi? Then look no further.</p>
              <p>Western Cars is the number one way to book a taxi. We cover more of West Sussex than anyone else. We offer a 24 hour service 7 days a week with local and experienced drivers. We offer competitive rates.</p>
              <p>
                Whether you’re in Crawley and need a taxi to the airport or you’re looking for a Crawley cab asap, local or long distance. Western Cars is the taxi company for you. Western Cars brings you the best
                and most comfortable taxi service.
              </p>
              <p>Give us a call or book online.</p>
            </div>
            <div className="wc-about__cta">
              <Link className="wc-btn--sharp" href="/contact-us/">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <QuickFacts />
      <WhyChooseUsBand />

      <WebPageSchema path={path} name={seo.title} description={seo.description} modified={modified} type="AboutPage" image={photo} />
      <BreadcrumbSchema path={path} crumbs={CRUMBS} />
    </>
  );
}
