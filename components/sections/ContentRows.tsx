import Image from "next/image";
import { RichText } from "@/components/ui/RichText";
import type { Block, ContentRow, ImageBlock } from "@/lib/content-types";
import { image } from "@/lib/images";

function ContentImage({ block, city }: { block: ImageBlock; city: string }) {
  const img = image(block.file);
  // Some WordPress images had no alt text; describe what the photo actually shows.
  const alt = block.alt.trim() || `Taxi roof sign — Western Cars taxi service in ${city}`;
  return (
    <div className={`wc-module wc-image${block.shadow ? " wc-image--shadow" : ""}`}>
      <div style={{ maxWidth: img.width }}>
        <Image src={img.src} width={img.width} height={img.height} alt={alt} sizes="(max-width: 980px) 80vw, 544px" />
      </div>
    </div>
  );
}

function Blocks({ blocks, city }: { blocks: Block[]; city: string }) {
  return (
    <>
      {blocks.map((b, i) => (b.type === "html" ? <RichText key={i} html={b.html} className="wc-module" /> : <ContentImage key={i} block={b} city={city} />))}
    </>
  );
}

/** Two-column text/photo rows from the page body (same order and widths as WordPress). */
export function ContentRows({ rows, city }: { rows: ContentRow[]; city: string }) {
  return (
    <>
      {rows.map((row, i) => (
        <div key={i} className={`wc-row${row.wide ? " wc-row--wide" : ""}`} style={row.paddingTop ? { paddingTop: row.paddingTop } : undefined}>
          <div className="wc-cols">
            {row.cols.map((col, j) => (
              <div key={j} className="wc-col wc-col--1-2">
                <Blocks blocks={col} city={city} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
