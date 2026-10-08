import Link from "next/link";
import { pathForArea } from "@/lib/areas";

interface AreasProps {
  heading?: string;
  /** Visual size of the heading (the original used h3-sized on most pages, h4-sized on two). */
  size?: "h3" | "h4";
  columns: string[][];
  keywords?: string | null;
  /** Path of the page being rendered — its own entry is shown as plain text instead of a self-link. */
  currentPath?: string;
  id?: string;
}

/** "Areas We Cover": every area that has a page now links to it (internal-linking hub). */
export function AreasCovered({ heading = "Areas We Cover", size = "h3", columns, keywords, currentPath, id = "areas-heading" }: AreasProps) {
  return (
    <div className="wc-areas">
      <div className="wc-row">
        <h3 id={id} className={`wc-areas__heading wc-areas__heading--${size}`}>
          {heading}
        </h3>
      </div>
      <div className="wc-row" role="group" aria-labelledby={id}>
        <div className="wc-cols">
          {columns.map((col, i) => (
            <div key={i} className="wc-col wc-col--1-3">
              <ul>
                {col.map((label) => {
                  const href = pathForArea(label);
                  return <li key={label}>{href && href !== currentPath ? <Link href={href}>{label}</Link> : label}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {keywords ? (
        <div className="wc-row">
          <p className="wc-areas__keywords">{keywords}</p>
        </div>
      ) : null}
    </div>
  );
}
