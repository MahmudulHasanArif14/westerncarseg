// Print CSS rules (from all inline <style> blocks of home.html + global-styles) whose selector matches given regex.
import fs from "node:fs";

const html = fs.readFileSync("migration/source/home.html", "utf8");
const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");

function* rules(text, media = "") {
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf("{", i);
    if (open < 0) return;
    const sel = text.slice(i, open).trim();
    let depth = 1;
    let j = open + 1;
    while (j < text.length && depth) {
      if (text[j] === "{") depth++;
      else if (text[j] === "}") depth--;
      j++;
    }
    const body = text.slice(open + 1, j - 1);
    if (sel.startsWith("@media")) yield* rules(body, sel);
    else if (!sel.startsWith("@")) yield { media, sel, body };
    i = j;
  }
}

const pats = process.argv.slice(2).map((p) => new RegExp(p));
const seen = new Set();
for (const r of rules(css)) {
  if (pats.some((p) => p.test(r.sel))) {
    const line = `${r.media ? r.media + " { " : ""}${r.sel}{${r.body}}${r.media ? " }" : ""}`;
    if (!seen.has(line)) {
      seen.add(line);
      console.log(line);
    }
  }
}
