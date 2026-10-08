import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbNode,
  faqNode,
  organizationNode,
  taxiServiceNode,
  webPageNode,
  webSiteNode,
  type Crumb,
  type FaqItem,
} from "@/lib/schema";

/** Business entity (LocalBusiness) — rendered once per page; other nodes reference it by @id. */
export function OrganizationSchema() {
  return <JsonLd data={organizationNode()} />;
}

export function WebSiteSchema() {
  return <JsonLd data={webSiteNode()} />;
}

export function WebPageSchema(props: Parameters<typeof webPageNode>[0]) {
  return <JsonLd data={webPageNode(props)} />;
}

export function BreadcrumbSchema({ path, crumbs }: { path: string; crumbs: Crumb[] }) {
  return <JsonLd data={breadcrumbNode(path, crumbs)} />;
}

export function ServiceSchema(props: Parameters<typeof taxiServiceNode>[0]) {
  return <JsonLd data={taxiServiceNode(props)} />;
}

/** Only render where the same Q&A is visible on the page. */
export function FAQSchema({ path, items }: { path: string; items: FaqItem[] }) {
  return <JsonLd data={faqNode(path, items)} />;
}
