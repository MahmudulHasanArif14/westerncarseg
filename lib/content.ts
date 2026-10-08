import { generatedPages } from "@/content/pages";
import type { LandingPage, TermsPage } from "@/lib/content-types";

export function getLandingPage(slug: string): LandingPage | undefined {
  const page = generatedPages[slug];
  return page?.kind === "landing" ? page : undefined;
}

export function getTermsPage(): TermsPage {
  const page = generatedPages["terms-conditions"];
  if (page?.kind !== "terms") throw new Error("terms-conditions content missing — run `npm run content`");
  return page;
}

/** Every landing page (home + 27 location/airport pages). */
export function getAllLandingPages(): LandingPage[] {
  return Object.values(generatedPages).filter((p): p is LandingPage => p.kind === "landing");
}

/** Location/airport pages served by app/[slug] (everything except the home page). */
export function getLocationSlugs(): string[] {
  return getAllLandingPages()
    .filter((p) => p.slug !== "home")
    .map((p) => p.slug);
}
