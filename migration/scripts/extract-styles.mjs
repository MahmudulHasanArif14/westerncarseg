import fs from "node:fs";

const html = fs.readFileSync("migration/source/home.html", "utf8");
const blocks = [...html.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)].map((m) => ({
  attrs: m[1],
  css: m[2],
}));
const want = process.argv.slice(2);
for (const b of blocks) {
  const id = (b.attrs.match(/id=["']([^"']+)["']/) || [])[1] || "";
  if (want.some((w) => id.includes(w))) {
    console.log(`/* ===== ${id} (${b.css.length}) ===== */`);
    console.log(b.css);
  }
}
