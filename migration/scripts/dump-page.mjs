import fs from "node:fs";
import { parse, dump } from "./divi-parse.mjs";

const pages = JSON.parse(fs.readFileSync("migration/source/pages.json", "utf8"));
for (const slug of process.argv.slice(2)) {
  const p = pages.find((x) => x.slug === slug);
  console.log(`\n######## ${slug}`);
  console.log(dump(parse(p.content.rendered)));
}
