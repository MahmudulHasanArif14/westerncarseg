import { SITE, absoluteUrl } from "@/lib/site";
import { AIRPORT_AREAS, ALL_AREAS } from "@/lib/areas";

/**
 * schema.org JSON-LD builders. Rules followed:
 *  - only facts published on the original site (no ratings, awards, coordinates or invented profiles)
 *  - stable @ids so separate <script> blocks on one page reference the same entities
 */
export const ID = {
  organization: `${SITE.url}/#organization`,
  website: `${SITE.url}/#website`,
  logo: `${SITE.url}/#logo`,
  taxiService: `${SITE.url}/#taxi-service`,
};

type Json = Record<string, unknown>;

const placeNode = (label: string): Json =>
  (AIRPORT_AREAS as readonly string[]).includes(label) ? { "@type": "Airport", name: `${label} Airport` } : { "@type": "Place", name: label };

export function organizationNode(): Json {
  return {
    "@type": "LocalBusiness",
    "@id": ID.organization,
    name: SITE.name,
    legalName: SITE.legalName,
    url: `${SITE.url}/`,
    description:
      "Western Cars is a private hire taxi company based in Crawley, West Sussex, providing local taxis, airport transfers, group travel and business accounts across East and West Sussex.",
    foundingDate: SITE.foundingYear,
    telephone: SITE.phone.e164,
    email: SITE.email,
    logo: { "@type": "ImageObject", "@id": ID.logo, url: absoluteUrl(`/images/${SITE.logo.file}`), contentUrl: absoluteUrl(`/images/${SITE.logo.file}`), width: SITE.logo.width, height: SITE.logo.height, caption: SITE.name },
    image: absoluteUrl(`/images/${SITE.logo.file}`),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "reservations",
        telephone: SITE.phone.e164,
        email: SITE.email,
        availableLanguage: "en",
        areaServed: "GB",
      },
    ],
    identifier: { "@type": "PropertyValue", propertyID: "Companies House number", value: SITE.companyNumber },
    areaServed: ALL_AREAS.map(placeNode),
    sameAs: SITE.sameAs,
  };
}

export function webSiteNode(): Json {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: `${SITE.url}/`,
    name: SITE.name,
    description: SITE.tagline,
    inLanguage: SITE.lang,
    publisher: { "@id": ID.organization },
  };
}

interface WebPageInput {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  modified?: string;
  /** File name under /public/images used as the page's primary image. */
  image?: { src: string; width: number; height: number };
  hasBreadcrumb?: boolean;
}

export function webPageNode({ path, name, description, type = "WebPage", modified, image, hasBreadcrumb = true }: WebPageInput): Json {
  const url = absoluteUrl(path);
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: SITE.lang,
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.organization },
    ...(modified ? { dateModified: modified.length === 19 ? `${modified}+00:00` : modified } : {}),
    ...(image ? { primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(image.src), width: image.width, height: image.height } } : {}),
    ...(hasBreadcrumb ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbNode(path: string, crumbs: Crumb[]): Json {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

interface TaxiServiceInput {
  /** Page the service description lives on. */
  path: string;
  name: string;
  serviceTypes: string[];
  /** Area labels (see lib/areas.ts). */
  areas: string[];
}

export function taxiServiceNode({ path, name, serviceTypes, areas }: TaxiServiceInput): Json {
  return {
    "@type": "TaxiService",
    "@id": `${absoluteUrl(path)}#taxi-service`,
    name,
    url: absoluteUrl(path),
    serviceType: serviceTypes,
    provider: { "@id": ID.organization },
    areaServed: areas.map(placeNode),
    availableChannel: { "@type": "ServiceChannel", serviceUrl: SITE.links.booking, servicePhone: { "@type": "ContactPoint", telephone: SITE.phone.e164, contactType: "reservations" } },
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqNode(path: string, items: FaqItem[]): Json {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

/** Serialise safely for inline <script>: prevents `</script>` / HTML comment breakouts. */
export function toJsonLd(data: Json | Json[]): string {
  const payload = Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : { "@context": "https://schema.org", ...data };
  return JSON.stringify(payload).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
