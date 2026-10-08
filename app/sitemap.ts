import type { MetadataRoute } from "next";
import { getAllLandingPages, getTermsPage } from "@/lib/content";
import { INNER_PAGES } from "@/lib/inner-pages";
import { absoluteUrl } from "@/lib/site";

/** Canonical, indexable URLs only (same 32 URLs the WordPress sitemap listed). */
const toDate = (iso: string) => new Date(/[zZ]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`);

export default function sitemap(): MetadataRoute.Sitemap {
  const landing = getAllLandingPages().map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: toDate(p.modified),
    changeFrequency: "monthly" as const,
    priority: p.slug === "home" ? 1 : 0.7,
  }));
  const inner = Object.values(INNER_PAGES).map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: toDate(p.modified),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));
  const terms = getTermsPage();
  return [
    ...landing,
    ...inner,
    { url: absoluteUrl(terms.path), lastModified: toDate(terms.modified), changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
