import type { Metadata } from "next";
import { PageBanner } from "@/components/sections/PageBanner";
import { WhyChooseUsBand } from "@/components/sections/WhyChooseUs";
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/schemas";
import { RichText } from "@/components/ui/RichText";
import { getTermsPage } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const page = getTermsPage();
export const metadata: Metadata = createPageMetadata({ title: page.seo.title, description: page.seo.description, path: page.path });

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Terms & Conditions", path: page.path },
];

export default function TermsPage() {
  return (
    <>
      <PageBanner h1={page.h1} crumbs={CRUMBS} />

      <section className="wc-section wc-terms" aria-label="Terms and conditions">
        <div className="wc-row">
          <RichText html={page.intro} />
          {page.sections.map((s) => (
            <section key={s.heading} aria-labelledby={`terms-${s.heading.split(".")[0].trim()}`}>
              <h2 id={`terms-${s.heading.split(".")[0].trim()}`}>{s.heading}</h2>
              <RichText html={s.html} />
            </section>
          ))}
        </div>
      </section>

      <WhyChooseUsBand />

      <WebPageSchema path={page.path} name={page.seo.title} description={page.seo.description} modified={page.modified} />
      <BreadcrumbSchema path={page.path} crumbs={CRUMBS} />
    </>
  );
}
