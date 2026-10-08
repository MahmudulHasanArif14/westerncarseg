// Downloads rendered HTML for a list of slugs into migration/source/html/<slug>.html
import fs from "node:fs";

const ORIGIN = "https://westerncars.co.uk";
const pages = JSON.parse(fs.readFileSync("migration/source/pages.json", "utf8"));
const all = process.argv.includes("--all");
const slugs = all ? pages.map((p) => p.slug) : process.argv.slice(2).filter((a) => !a.startsWith("--"));
fs.mkdirSync("migration/source/html", { recursive: true });

for (const slug of slugs) {
  const url = slug === "home" ? `${ORIGIN}/` : `${ORIGIN}/${slug}/`;
  const res = await fetch(url, { redirect: "manual" });
  const body = await res.text();
  fs.writeFileSync(`migration/source/html/${slug}.html`, body);
  console.log(res.status, url, body.length, res.headers.get("location") || "");
}
