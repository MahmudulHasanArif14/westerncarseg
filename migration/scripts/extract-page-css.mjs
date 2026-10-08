import fs from "node:fs";

for (const slug of process.argv.slice(2)) {
  const html = fs.readFileSync(`migration/source/html/${slug}.html`, "utf8");
  const blocks = [...html.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)];
  const wanted = blocks.filter((b) => /et-builder-module-design|et-builder-page-custom|page-custom|et-core-unified/.test(b[1]));
  const css = wanted.map((b) => b[2]).join("\n");
  fs.writeFileSync(`migration/source/css-${slug}.css`, css);
  const customCss = [...html.matchAll(/<style[^>]*id=["']et-builder-page-custom-style["'][^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
  console.log(slug, "module css:", css.length, "page-custom:", customCss.length, "ids:", blocks.map((b) => (b[1].match(/id=["']([^"']+)/) || [])[1]).filter(Boolean).join(","));
}
