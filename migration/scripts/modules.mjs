import fs from "node:fs";

const pages = JSON.parse(fs.readFileSync("migration/source/pages.json", "utf8"));
const counts = {};
const attrs = {};
for (const p of pages) {
  for (const m of p.content.rendered.matchAll(/\[(et_pb_[a-z_]+)([^\]]*)\]/g)) {
    counts[m[1]] = (counts[m[1]] || 0) + 1;
    for (const a of m[2].matchAll(/\s([a-z_0-9]+)=&#8221;/g)) {
      (attrs[m[1]] ||= new Set()).add(a[1]);
    }
  }
}
console.log(counts);
for (const [k, v] of Object.entries(attrs)) {
  console.log(k, [...v].filter((a) => !a.startsWith("_") && a !== "global_colors_info").join(" "));
}
