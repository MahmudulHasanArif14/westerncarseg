import { getAllLandingPages } from "@/lib/content";

/**
 * "Areas We Cover" labels → internal page. On WordPress only 3 of ~28 labels were linked,
 * which left most location pages orphaned. Every label that has a page now links to it.
 */
export const AREA_PATHS: Record<string, string> = {
  Crawley: "/",
  "East Grinstead": "/taxi-service-in-east-grinstead/",
  "Burgess Hill": "/taxi-service-in-burgess-hill/",
  "Haywards Heath": "/haywards-heath-taxi/",
  Hassocks: "/hassocks-taxi/",
  Ardingly: "/ardingly-taxi/",
  Henfield: "/henfield-taxi/",
  Lewes: "/lewes-taxi/",
  "London City": "/airport-taxi-london-city/",
  Luton: "/airport-taxi-luton/",
  Steyning: "/steyning-taxi/",
  Worthing: "/worthing-taxi/",
  Horsham: "/horsham-taxi/",
  Copthorne: "/copthorne-taxi/",
  Southwater: "/southwater-taxi/",
  Billingshurst: "/billingshurst-taxi/",
  Arundel: "/arundel-taxi/",
  Chichester: "/chichester-taxi/",
  Southend: "/airport-taxi-southend/",
  "Biggin Hill": "/airport-taxi-biggin-hill/",
  Petworth: "/petworth-taxi/",
  Midhurst: "/midhurst-taxi/",
  Littlehampton: "/littlehampton-taxi/",
  "Bognor Regis": "/bognor-regis-taxi/",
  Horley: "/horley-taxi/",
  Gatwick: "/gatwick-taxi/",
  Heathrow: "/heathrow-taxi/",
  Stansted: "/stansted-taxi/",
};

export const AIRPORT_AREAS = ["Gatwick", "Heathrow", "Stansted", "Luton", "London City", "Southend", "Biggin Hill"] as const;

/** Names of all areas served, for schema.org `areaServed`. */
export const ALL_AREAS = Object.keys(AREA_PATHS);

export function pathForArea(label: string): string | undefined {
  return AREA_PATHS[label];
}

/** Sanity helper used by the link audit: every landing page should be reachable from AREA_PATHS. */
export function unlinkedLandingSlugs(): string[] {
  const linked = new Set(Object.values(AREA_PATHS));
  return getAllLandingPages()
    .filter((p) => !linked.has(p.path))
    .map((p) => p.slug);
}
