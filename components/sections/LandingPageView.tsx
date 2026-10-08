import { AppSection } from "@/components/sections/AppSection";
import { AreasCovered } from "@/components/sections/AreasCovered";
import { BookStrip } from "@/components/sections/BookStrip";
import { ContentRows } from "@/components/sections/ContentRows";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSlider } from "@/components/sections/HeroSlider";
import { WhyChooseUsLanding } from "@/components/sections/WhyChooseUs";
import { BreadcrumbSchema, FAQSchema, ServiceSchema, WebPageSchema } from "@/components/seo/schemas";
import { ALL_AREAS } from "@/lib/areas";
import type { LandingPage } from "@/lib/content-types";
import { HOME_FAQ } from "@/lib/faq";
import { image } from "@/lib/images";
import { SITE } from "@/lib/site";

/**
 * Home page and all 27 location/airport pages share this template (same sections, same order as
 * the WordPress pages). Only the per-page data in content/pages/*.json differs.
 */
export function LandingPageView({ page }: { page: LandingPage }) {
  const isHome = page.slug === "home";
  const hasPhoto = page.rows.flatMap((r) => r.cols).flat().some((b) => b.type === "image");
  const primaryImage = hasPhoto ? image("Taxi-Image.jpg") : undefined;

  const serviceTypes = isHome
    ? ["Taxi service", "Private hire", "Airport transfers", "Station transfers", "Group travel", "Chauffeur service", "Business accounts"]
    : page.isAirport
      ? ["Airport taxi transfers"]
      : ["Local taxi service", "Airport transfers"];

  const areasBlock = (
    <AreasCovered heading={page.areas.heading} size={page.areas.level} columns={page.areas.columns} keywords={page.areas.keywords} currentPath={page.path} />
  );

  return (
    <>
      <HeroSlider page={page} />
      <BookStrip />

      <section className="wc-section wc-main-block" aria-label={`Taxi service in ${page.city}`}>
        <div className="wc-row wc-welcome">
          <h2>{page.welcome.h2}</h2>
          <p className="wc-welcome__tagline">{page.welcome.tagline}</p>
          <div className="wc-divider" aria-hidden="true" />
          <div className="wc-btn-wrap">
            <a className="wc-btn wc-btn--solid" href={SITE.links.booking} target="_blank" rel="noopener noreferrer">
              BOOK ONLINE NOW<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <ContentRows rows={page.rows} city={page.city} />
        {isHome ? (
          <div className="wc-row">
            <FaqSection items={HOME_FAQ} />
          </div>
        ) : null}
      </section>

      <AppSection />

      <WhyChooseUsLanding>{page.areas.separateSection ? null : areasBlock}</WhyChooseUsLanding>
      {page.areas.separateSection ? <section className="wc-section">{areasBlock}</section> : null}

      <WebPageSchema path={page.path} name={page.seo.title} description={page.seo.description} modified={page.modified} image={primaryImage} hasBreadcrumb={!isHome} />
      {isHome ? null : (
        <BreadcrumbSchema
          path={page.path}
          crumbs={[
            { name: "Home", path: "/" },
            { name: page.welcome.tagline, path: page.path },
          ]}
        />
      )}
      <ServiceSchema path={page.path} name={isHome ? `${SITE.name} taxi and private hire` : `${page.city} taxi service — ${SITE.shortName}`} serviceTypes={serviceTypes} areas={isHome ? ALL_AREAS : [page.city]} />
      {isHome ? <FAQSchema path={page.path} items={HOME_FAQ} /> : null}
    </>
  );
}
