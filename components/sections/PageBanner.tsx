import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BgImage } from "@/components/ui/BgImage";
import type { Crumb } from "@/lib/schema";

/** Photo banner with the page's H1 (About / Services / Contact / Terms). The banner photo is the LCP image. */
export function PageBanner({ h1, subtitle, crumbs }: { h1: string; subtitle?: string; crumbs: Crumb[] }) {
  return (
    <section className="wc-section wc-banner" aria-label={h1}>
      <BgImage file="Wester-Cars-Page-Header.jpg" priority quality={60} />
      <div className="wc-row">
        <Breadcrumbs crumbs={crumbs} />
        <h1>{h1}</h1>
        {subtitle ? <h2>{subtitle}</h2> : null}
      </div>
    </section>
  );
}
