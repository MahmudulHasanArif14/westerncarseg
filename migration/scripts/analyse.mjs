import fs from "node:fs";

const pages = JSON.parse(fs.readFileSync("migration/source/pages.json", "utf8"));
const decode = (s) =>
  s
    .replace(/&#8221;|&#8243;|&#8220;/g, '"')
    .replace(/&#8217;/g, "’")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&nbsp;/g, " ");

const out = [];
for (const p of pages) {
  const raw = p.content.rendered;
  const sc = [...raw.matchAll(/\[(et_pb_[a-z_]+)/g)].map((m) => m[1]);
  const sig = sc.join(",");
  const imgs = [...new Set([...raw.matchAll(/https?:\/\/westerncars\.co\.uk\/wp-content\/uploads\/[^\s"'&<\]]+/g)].map((m) => m[0]))];
  const links = [...new Set([...raw.matchAll(/href=\\?"([^"\\]+)/g)].map((m) => m[1]))];
  const headings = [...raw.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => `h${m[1]}:${m[2].replace(/<[^>]+>/g, "")}`);
  const headingAttr = [...decode(raw).matchAll(/heading="([^"]*)"/g)].map((m) => m[1]);
  out.push({ slug: p.slug, id: p.id, parent: p.parent, template: p.template, title: p.title.rendered, sigHash: sig.length, imgs, links, headings, headingAttr: [...new Set(headingAttr)], modified: p.modified });
}
fs.writeFileSync("migration/source/analysis.json", JSON.stringify(out, null, 2));

// Group by signature
const groups = {};
for (const p of pages) {
  const sig = [...p.content.rendered.matchAll(/\[(et_pb_[a-z_]+)/g)].map((m) => m[1]).join(",");
  (groups[sig] ||= []).push(p.slug);
}
console.log("TOTAL", pages.length);
Object.entries(groups).forEach(([sig, slugs], i) => console.log(`GROUP ${i} (${sig.split(",").length} modules):`, slugs.join(", ")));
for (const o of out) {
  console.log(`\n== ${o.slug} | ${o.title} | mod ${o.modified}`);
  console.log(" headingAttr:", o.headingAttr.join(" || "));
  console.log(" headings:", o.headings.join(" | "));
  console.log(" imgs:", o.imgs.map((u) => u.split("/uploads/")[1]).join(", "));
  console.log(" links:", o.links.join(", "));
}
