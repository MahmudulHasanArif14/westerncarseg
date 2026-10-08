import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Everything public is crawlable (the WordPress robots.txt had an empty Disallow). Search and AI
 * crawlers are not blocked. Only the form endpoint is excluded.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
