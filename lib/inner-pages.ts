import type { SeoMeta } from "@/lib/content-types";

/** SEO data (titles/descriptions preserved from Yoast) for the hand-built inner pages. */
export const INNER_PAGES = {
  "our-services": {
    path: "/our-services/",
    seo: {
      title: "Western Cars Crawley - Crawley Taxi Company - Our Services",
      description: "Our Crawley taxi services include Airport Taxi, Private Taxi Hire, Group Minibus Bookings, VIP Transport and business accounts.",
    } satisfies SeoMeta,
    modified: "2021-04-07T09:49:16+00:00",
  },
  "about-us": {
    path: "/about-us/",
    seo: {
      title: "Western Cars Crawley - Local Taxi Service In Crawley, West Sussex",
      description: "Western Cars are an established local taxi and private hire company offering taxi services in Crawley, West Sussex. Call us to book.",
    } satisfies SeoMeta,
    modified: "2022-02-15T12:12:39+00:00",
  },
  "contact-us": {
    path: "/contact-us/",
    seo: {
      title: "Western Cars Crawley - Contact Us Or Book Your Crawley Taxi",
      description: "Contact Western Cars Crawley on 01293 300 000 or download our app to book your next taxi journey. We look forward to hearing from you.",
    } satisfies SeoMeta,
    modified: "2022-10-03T08:46:40+00:00",
  },
} as const;
