export type HtmlBlock = { type: "html"; html: string };
export type ImageBlock = { type: "image"; file: string; alt: string; title: string; shadow: boolean };
export type Block = HtmlBlock | ImageBlock;

export interface ContentRow {
  /** Divi row with max-width 1920px (wider than the default 1080px container). */
  wide: boolean;
  paddingTop?: string;
  cols: Block[][];
}

export interface SeoMeta {
  title: string;
  description: string;
}

export interface LandingPage {
  kind: "landing";
  slug: string;
  path: string;
  city: string;
  isAirport: boolean;
  seo: SeoMeta;
  /** ISO-ish timestamp of last edit in WordPress. */
  modified: string;
  hero: { h1: string; h2: string; backgrounds: string[] };
  welcome: { h2: string; tagline: string };
  rows: ContentRow[];
  areas: {
    heading: string;
    level: "h3" | "h4";
    separateSection: boolean;
    columns: string[][];
    keywords: string | null;
  };
}

export interface TermsPage {
  kind: "terms";
  slug: string;
  path: string;
  seo: SeoMeta;
  modified: string;
  h1: string;
  intro: string;
  sections: { heading: string; html: string }[];
}

export type AnyPage = LandingPage | TermsPage;
