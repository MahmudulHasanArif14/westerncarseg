import { toJsonLd } from "@/lib/schema";

/** Renders a single JSON-LD block (server component, no client JS). */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(data) }} />;
}
