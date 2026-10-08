// Collects every wp-content/uploads image referenced by the pages/CSS and downloads the originals into public/images/.
import fs from "node:fs";
import path from "node:path";

const sources = [
  fs.readFileSync("migration/source/pages.json", "utf8").replace(/\\\//g, "/"),
  fs.readFileSync("migration/source/home.html", "utf8"),
  fs.readFileSync("migration/source/module-design.css", "utf8"),
  fs.readFileSync("migration/source/divi-style-inline.css", "utf8"),
  ...fs.readdirSync("migration/source/html").map((f) => fs.readFileSync(`migration/source/html/${f}`, "utf8")),
];
const re = /https?:\/\/(?:www\.)?westerncars\.co\.uk\/wp-content\/uploads\/[A-Za-z0-9_\-\/.%]+\.(?:png|jpe?g|webp|gif|svg)/gi;
const urls = new Set();
for (const s of sources) for (const m of s.matchAll(re)) urls.add(m[0].replace(/^http:/, "https:").replace("//www.", "//"));

// Drop WordPress-generated resized variants (e.g. foo-300x177.png) — we only want originals.
const originals = [...urls].filter((u) => !/-\d+x\d+\.(png|jpe?g|webp)$/i.test(u));
const resized = [...urls].filter((u) => /-\d+x\d+\.(png|jpe?g|webp)$/i.test(u));

fs.mkdirSync("public/images", { recursive: true });
const manifest = [];
for (const url of originals.sort()) {
  const file = path.basename(new URL(url).pathname);
  const res = await fetch(url);
  if (!res.ok) {
    console.log("FAIL", res.status, url);
    manifest.push({ url, file, ok: false, status: res.status });
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(`public/images/${file}`, buf);
  manifest.push({ url, file, ok: true, bytes: buf.length, type: res.headers.get("content-type") });
  console.log("OK  ", String(buf.length).padStart(8), file);
}
fs.mkdirSync("migration/reports", { recursive: true });
fs.writeFileSync("migration/reports/image-manifest.json", JSON.stringify({ manifest, skippedResizedVariants: resized }, null, 2));
