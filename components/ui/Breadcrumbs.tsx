import Link from "next/link";
import type { Crumb } from "@/lib/schema";

/** Visible breadcrumb trail (paired with BreadcrumbSchema on the page). */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="wc-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path}>
              {last ? <span aria-current="page">{c.name}</span> : <Link href={c.path}>{c.name}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
