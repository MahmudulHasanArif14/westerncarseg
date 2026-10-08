import type { ElementType } from "react";

/**
 * Renders migrated body copy. The HTML comes from our own build-time content files
 * (content/pages/*.json, produced by migration/scripts/build-content.mjs) — never from user input.
 */
export function RichText({ html, as: Tag = "div", className = "" }: { html: string; as?: ElementType; className?: string }) {
  return <Tag className={`wc-richtext ${className}`.trim()} dangerouslySetInnerHTML={{ __html: html }} />;
}
