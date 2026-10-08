// Converts the Divi page source (migration/source/pages.json) into typed JSON under content/pages/.
// Also writes migration/reports/content-corrections.md listing every copy fix applied.
import fs from "node:fs";
import path from "node:path";
import { parse } from "./divi-parse.mjs";

const pages = JSON.parse(fs.readFileSync("migration/source/pages.json", "utf8"));
const OUT = "content/pages";
fs.mkdirSync(OUT, { recursive: true });

const corrections = [];
const note = (slug, what, from, to) => corrections.push({ slug, what, from, to });

// Explicit fixes for text that names the wrong town (pasted from another location page).
const COPY_FIXES = {
  "airport-taxi-southend": [["London City Female Taxi Service", "Southend Female Taxi Service"]],
  "lewes-taxi": [["Hassocks Female Taxi Service", "Lewes Female Taxi Service"], ["comfortable drive around Hassocks", "comfortable drive around Lewes"]],
  "copthorne-taxi": [["Hassocks Female Taxi Service", "Copthorne Female Taxi Service"], ["comfortable drive around Hassocks", "comfortable drive around Copthorne"]],
  "horsham-taxi": [
    ["comfortable drive around Hassocks", "comfortable drive around Horsham"],
    ["female-led taxi company in Hassocks", "female-led taxi company in Horsham"],
    ["reliable taxi service Hassocks has ever seen", "reliable taxi service Horsham has ever seen"],
  ],
  // Formatting: one link was split across two <a> tags ("Western " + "Car" + "s")
  home: [[`<a href="https://westerncars.com/">Western </a><a href="https://westerncars.com/" target="_blank" rel="noopener noreferrer">Car</a>s Taxi Crawley`, `<a href="https://westerncars.com/" target="_blank" rel="noopener noreferrer">Western Cars</a> Taxi Crawley`]],
  "stansted-taxi": [["StanstedLuxury Taxi Service", "Luxury Taxi Service"]],
  "airport-taxi-london-city": [["Operating from Gatwick", "Operating from London City"]],
  "chichester-taxi": [["Need a taxi from Horsham to Crawley?", "Need a taxi from Chichester to Crawley?"]],
};
const IMG = (url) => path.basename(new URL(url.replace(/^http:/, "https:")).pathname);

// ---------- generic helpers
const walk = (node, fn) => {
  fn(node);
  (node.children || []).forEach((c) => walk(c, fn));
};
const find = (node, tag) => {
  const out = [];
  walk(node, (n) => n.tag === tag && out.push(n));
  return out;
};
const textOf = (node) => (node.children || []).filter((c) => c.tag === "#text").map((c) => c.html).join("\n");
const plain = (html) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

function cleanHtml(slug, html) {
  let h = html;
  const before = h;
  // unwrap tailwind-garbage and attribute-less spans (repeat for nesting)
  for (let i = 0; i < 4; i++) {
    h = h.replace(/<span\s+class="hover:[^"]*"[^>]*>([\s\S]*?)<\/span>/g, "$1");
    h = h.replace(/<span(?:\s+style="[^"]*")?>([\s\S]*?)<\/span>/g, "$1");
  }
  h = h
    .replace(/\s+lang="en-IN"/g, "")
    .replace(/\s+class="(western|text-justify)"/g, "")
    .replace(/\s+style="text-align:\s*(left|center);?"/g, "")
    .replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/g, "")
    .replace(/&nbsp;|\u00a0/g, " ")
    .replace(/`/g, "’")
    .replace(/\bStanstead\b/g, "Stansted")
    .replace(/<h([1-6])[^>]*>\s*Taxi\s+([^<]+?)\s*<\/h\1>/g, "<h$1>Taxi $2</h$1>");
  if (before.includes("`")) note(slug, "Backtick used as apostrophe", "`", "’");
  if (before.includes("Stanstead")) note(slug, "Spelling", "Stanstead", "Stansted");
  // links
  h = h.replace(/href="https?:\/\/(?:www\.)?westerncars\.co\.uk(\/[^"]*)?"/g, (m, p) => `href="${p || "/"}"`);
  h = h.replace(/href="\/(our-services|contact-us)"/g, 'href="/$1/"');
  h = h.replace(/href="tel:(?:0044|\+44)?0?1293300000"/g, 'href="tel:+441293300000"');
  h = h.replace(/href="tel:00441342300000"/g, 'href="tel:+441342300000"');
  h = h.replace(/<a ([^>]*?)target="_blank"([^>]*?)>/g, (m, a, b) => {
    const attrs = `${a}${b}`.replace(/\s*rel="[^"]*"/g, "");
    return `<a ${attrs.trim()} target="_blank" rel="noopener noreferrer">`;
  });
  h = h.replace(/<a\s+href="(http:\/\/icab\.bi\/Western)"/g, '<a href="https://icab.bi/Western"');
  // autop for bare text
  if (!/<(p|h\d|ul|ol|div)[\s>]/.test(h)) {
    h = h
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => `<p>${l}</p>`)
      .join("\n");
  }
  for (const [fromStr, toStr] of COPY_FIXES[slug] || []) {
    if (h.includes(fromStr)) {
      h = h.split(fromStr).join(toStr);
      note(slug, slug === "home" ? "Formatting: split link merged" : "Wrong place name (copy pasted from another page)", fromStr, toStr);
    }
  }
  return h.replace(/\n{2,}/g, "\n").trim();
}

// ---------- contextual internal links (wrap words that already exist in the copy; no wording changes)
const AIRPORT_LINKS = {
  Gatwick: "/gatwick-taxi/",
  Heathrow: "/heathrow-taxi/",
  Stansted: "/stansted-taxi/",
  Luton: "/airport-taxi-luton/",
  "London City": "/airport-taxi-london-city/",
  Southend: "/airport-taxi-southend/",
  "Biggin Hill": "/airport-taxi-biggin-hill/",
};
const AIRPORT_GATE = /(including (Gatwick|Heathrow)|London Airplane terminals|arrivals at Gatwick)/;
const linkState = new Map(); // slug -> Set of keys already linked on that page

function addContextualLinks(slug, city, html) {
  const done = linkState.get(slug) ?? new Set();
  linkState.set(slug, done);
  return html.replace(/<p>([\s\S]*?)<\/p>/g, (whole, inner) => {
    const parts = inner.split(/(<a\b[\s\S]*?<\/a>)/); // even indexes are outside existing links
    const linkOnce = (key, re, href) => {
      if (done.has(key)) return;
      for (let i = 0; i < parts.length; i += 2) {
        const m = re.exec(parts[i]);
        if (m) {
          parts[i] = parts[i].slice(0, m.index) + `<a href="${href}">${m[0]}</a>` + parts[i].slice(m.index + m[0].length);
          done.add(key);
          return;
        }
      }
    };
    linkOnce("transfers", /airport transfers?/i, "/our-services/");
    linkOnce("crawley", /(?<=\bto )Crawley(?=\?)/, "/");
    if (AIRPORT_GATE.test(inner)) {
      for (const [name, href] of Object.entries(AIRPORT_LINKS)) {
        if (name === city) continue;
        linkOnce(`ap-${name}`, new RegExp(`\\b${name}\\b`), href);
      }
    }
    return `<p>${parts.join("")}</p>`;
  });
}

function blocksOfColumn(slug, col, ctx) {
  const blocks = [];
  for (const c of col.children) {
    if (c.tag === "et_pb_text") {
      let html = cleanHtml(slug, textOf(c));
      if (html && ctx?.landing) html = addContextualLinks(slug, ctx.city, html);
      if (html) blocks.push({ type: "html", html });
    } else if (c.tag === "et_pb_image") {
      const file = IMG(c.attrs.src);
      blocks.push({
        type: "image",
        file,
        alt: c.attrs.alt || "",
        title: c.attrs.title_text || "",
        shadow: Boolean(c.attrs.box_shadow_style),
      });
    }
  }
  return blocks;
}

// ---------- city names
const CITY = {
  home: "Crawley",
  "airport-taxi-luton": "Luton",
  "airport-taxi-biggin-hill": "Biggin Hill",
  "airport-taxi-southend": "Southend",
  "airport-taxi-london-city": "London City",
  "chichester-taxi": "Chichester",
  "lewes-taxi": "Lewes",
  "stansted-taxi": "Stansted",
  "heathrow-taxi": "Heathrow",
  "gatwick-taxi": "Gatwick",
  "horley-taxi": "Horley",
  "bognor-regis-taxi": "Bognor Regis",
  "littlehampton-taxi": "Littlehampton",
  "midhurst-taxi": "Midhurst",
  "petworth-taxi": "Petworth",
  "arundel-taxi": "Arundel",
  "billingshurst-taxi": "Billingshurst",
  "southwater-taxi": "Southwater",
  "copthorne-taxi": "Copthorne",
  "horsham-taxi": "Horsham",
  "worthing-taxi": "Worthing",
  "steyning-taxi": "Steyning",
  "henfield-taxi": "Henfield",
  "ardingly-taxi": "Ardingly",
  "hassocks-taxi": "Hassocks",
  "haywards-heath-taxi": "Haywards Heath",
  "taxi-service-in-burgess-hill": "Burgess Hill",
  "taxi-service-in-east-grinstead": "East Grinstead",
};
const AIRPORTS = new Set(["airport-taxi-luton", "airport-taxi-biggin-hill", "airport-taxi-southend", "airport-taxi-london-city", "stansted-taxi", "heathrow-taxi", "gatwick-taxi"]);
const ALL_NAMES = ["Crawley", "East Grinstead", "Burgess Hill", "Haywards Heath", "Hassocks", "Ardingly", "Henfield", "London City", "Luton", "Steyning", "Worthing", "Horsham", "Copthorne", "Southwater", "Billingshurst", "Arundel", "Southend", "Biggin Hill", "Petworth", "Midhurst", "Littlehampton", "Bognor Regis", "Horley", "Gatwick", "Heathrow", "Stansted", "Chichester", "Lewes"];

// ---------- landing pages
const SHARED = { strip: new Set(), app: new Set(), why: new Set(), slideBody: new Set() };
const mismatchReport = [];

function convertLanding(p) {
  const slug = p.slug;
  const city = CITY[slug];
  const tree = parse(p.content.rendered);
  const sections = tree.children.filter((c) => c.tag === "et_pb_section");

  // --- hero
  const slider = sections.find((s) => find(s, "et_pb_fullwidth_slider").length);
  const slides = find(slider, "et_pb_slide");
  const s0 = slides[0];
  const slideHtml = textOf(s0);
  const h2 = (slideHtml.match(/<h2>([\s\S]*?)<\/h2>/) || [])[1];
  const blurb = (slideHtml.match(/<p>(Book a cab[\s\S]*?)<\/p>/) || [])[1];
  SHARED.slideBody.add(plain(blurb || ""));
  let heading = s0.attrs.heading;
  const slideHeadings = slides.map((s) => s.attrs.heading);
  const slideH2s = slides.map((s) => plain((textOf(s).match(/<h2>([\s\S]*?)<\/h2>/) || [])[1] || ""));
  const norm = (t) => t.replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  // use the first (primary) slide heading; log the odd ones
  slideHeadings.slice(1).forEach((h, i) => norm(h) !== norm(heading) && note(slug, `Slide ${i + 2} heading inconsistent (consolidated to one H1)`, norm(h), norm(heading)));
  let h2Text = plain(h2);
  if (slideH2s.some((t) => t !== slideH2s[0])) note(slug, "Slides had differing sub-headings (first slide used)", slideH2s.join(" | "), h2Text);
  heading = heading.replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  if (/^Western Cars & Taxis\s+(\S.*?)\1$/.test(heading)) {
    const fixed = `Western Cars & Taxis ${city}`;
    note(slug, "Slide heading duplicated city", heading, fixed);
    heading = fixed;
  }
  const bgs = slides.map((s) => IMG(s.attrs.background_image));

  // --- strip + shared sections sanity
  const stripSec = sections.find((s) => plain(find(s, "et_pb_text").map(textOf).join(" ")).startsWith("Book Your Taxi"));
  SHARED.strip.add(plain(find(stripSec, "et_pb_text").map(textOf).join("|")) + find(stripSec, "et_pb_button").map((b) => b.attrs.button_text + b.attrs.button_url).join("|"));

  // --- main content section: contains the "Welcome to" text
  const main = sections.find((s) => find(s, "et_pb_text").some((t) => /Welcome to/.test(textOf(t))));
  const rows = main.children.filter((c) => c.tag === "et_pb_row");
  const welcomeRow = rows[0];
  const wTexts = find(welcomeRow, "et_pb_text").map((t) => plain(textOf(t)));
  let welcomeH2 = wTexts[0];
  const tagline = wTexts[1];
  if (welcomeH2 === "Welcome to Western Cars & Taxis" && slug !== "home") {
    const fixed = `Welcome to Western Cars & Taxis ${city}`;
    note(slug, "Welcome heading was missing the place name", welcomeH2, fixed);
    welcomeH2 = fixed;
  }
  const contentRows = rows.slice(1).map((r) => {
    const cols = r.children.filter((c) => c.tag === "et_pb_column");
    const padTop = (r.attrs.custom_padding || "").split("|")[0];
    return {
      wide: r.attrs.max_width === "1920px",
      ...(padTop ? { paddingTop: padTop } : {}),
      cols: cols.map((c) => blocksOfColumn(slug, c, { landing: true, city }).flat()),
    };
  });

  // --- app section
  const appSec = sections.find((s) => s.attrs.background_image && /Phone-App-Background/.test(s.attrs.background_image));
  SHARED.app.add(plain(find(appSec, "et_pb_text").map(textOf).join("|")));

  // --- why choose us + areas
  const whySec = sections.find((s) => find(s, "et_pb_text").some((t) => /Why Choose Us/.test(textOf(t))));
  SHARED.why.add(plain(find(whySec, "et_pb_text").filter((t) => /<h4>/.test(textOf(t))).map(textOf).join("|")));
  const headingMod = find(tree, "et_pb_heading")[0];
  let areaHeading = headingMod.attrs.title;
  if (areaHeading === "Areas We Covers") {
    note(slug, "Typo in heading", areaHeading, "Areas We Cover");
    areaHeading = "Areas We Cover";
  }
  const areaRow = find(tree, "et_pb_row").find((r) => r.attrs.column_structure === "1_3,1_3,1_3" && find(r, "et_pb_text").some((t) => /<ul>/.test(textOf(t))));
  const areaCols = areaRow.children
    .filter((c) => c.tag === "et_pb_column")
    .map((c) =>
      [...textOf(find(c, "et_pb_text")[0]).matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => {
        let label = plain(m[1]);
        if (label === "Stanstead") label = "Stansted";
        if (label === "Burgess hill") label = "Burgess Hill";
        return label;
      }),
    );
  const kwRow = find(tree, "et_pb_row").slice(-1)[0];
  let keywords = null;
  if (kwRow !== areaRow && kwRow.attrs.column_structure === undefined) {
    const t = find(kwRow, "et_pb_text")[0];
    if (t && !/<ul>/.test(textOf(t))) keywords = plain(cleanHtml(slug, textOf(t)));
  }

  // --- cross-city leakage check in editorial copy
  const copy = contentRows.flatMap((r) => r.cols).flat().filter((b) => b.type === "html").map((b) => plain(b.html)).join(" ");
  const leaks = ALL_NAMES.filter((n) => n !== city && n !== "Crawley" && !["Gatwick", "Heathrow", "Stansted", "Luton", "London City", "Southend", "Biggin Hill"].includes(n) && new RegExp(`\\b${n}\\b`).test(copy));
  if (leaks.length) mismatchReport.push({ slug, leaks });

  return {
    kind: "landing",
    slug,
    path: slug === "home" ? "/" : `/${slug}/`,
    city,
    isAirport: AIRPORTS.has(slug),
    seo: { title: p.yoast_head_json.title, description: p.yoast_head_json.description },
    modified: p.modified,
    hero: { h1: heading, h2: h2Text, backgrounds: bgs },
    welcome: { h2: welcomeH2, tagline },
    rows: contentRows,
    areas: {
      heading: areaHeading,
      level: headingMod.attrs.title_level || "h3",
      separateSection: !find(whySec, "et_pb_heading").length,
      columns: areaCols,
      keywords,
    },
  };
}

// ---------- terms
function convertTerms(p) {
  const tree = parse(p.content.rendered);
  const sections = tree.children.filter((c) => c.tag === "et_pb_section");
  const body = sections.find((s) => find(s, "et_pb_text").some((t) => /1\. Conditions<\/h1>/.test(textOf(t))));
  const html = cleanHtml("terms-conditions", textOf(find(body, "et_pb_text")[0]));
  // split by <h1>
  const parts = html.split(/(?=<h1>)/).map((s) => s.trim()).filter(Boolean);
  const intro = parts.shift();
  const sec = parts.map((s) => {
    const m = s.match(/^<h1>([\s\S]*?)<\/h1>\s*([\s\S]*)$/);
    return { heading: plain(m[1]), html: m[2].trim() };
  });
  let description = p.yoast_head_json.description;
  if (description.includes("westercars.co.uk")) {
    note("terms-conditions", "Meta description pointed to a mistyped email domain", "info@westercars.co.uk", "info@westerncars.co.uk");
    description = description.replace("westercars.co.uk", "westerncars.co.uk");
  }
  return {
    kind: "terms",
    slug: "terms-conditions",
    path: "/terms-conditions/",
    seo: { title: p.yoast_head_json.title, description },
    modified: p.modified,
    h1: "Terms & Conditions",
    intro: intro.replace(/^<h1>[\s\S]*?<\/h1>\s*/, ""),
    sections: sec,
  };
}

// ---------- run
const index = [];
for (const p of pages) {
  let data;
  if (p.slug === "terms-conditions") data = convertTerms(p);
  else if (CITY[p.slug]) data = convertLanding(p);
  else continue;
  fs.writeFileSync(path.join(OUT, `${p.slug}.json`), JSON.stringify(data, null, 2) + "\n");
  index.push(p.slug);
}

// shared-section consistency report
const shared = Object.entries(SHARED).map(([k, v]) => `${k}: ${v.size} distinct variant(s)`);
console.log("Shared section variants ->", shared.join("; "));
if (SHARED.slideBody.size > 1 || SHARED.app.size > 1 || SHARED.why.size > 1 || SHARED.strip.size > 1) {
  console.log("!! shared sections differ between pages:", [...SHARED.app].slice(0, 3));
}
console.log("Possible cross-city copy leaks (towns mentioned that aren't the page's own):");
mismatchReport.forEach((m) => console.log("  ", m.slug, m.leaks.join(", ")));

// typed barrel file
const importLines = index.map((s, i) => `import p${i} from "./${s}.json";`).join("\n");
const mapLines = index.map((s, i) => `  "${s}": p${i} as unknown as AnyPage,`).join("\n");
fs.writeFileSync(
  path.join(OUT, "index.ts"),
  `// AUTO-GENERATED by migration/scripts/build-content.mjs — do not edit by hand.\nimport type { AnyPage } from "@/lib/content-types";\n${importLines}\n\nexport const generatedPages: Record<string, AnyPage> = {\n${mapLines}\n};\n`,
);

fs.mkdirSync("migration/reports", { recursive: true });
const md =
  `# Content corrections applied during migration\n\nEvery edit to original copy is listed here. Nothing else was reworded.\n\n| Page | Change | From | To |\n| --- | --- | --- | --- |\n` +
  corrections.map((c) => `| ${c.slug} | ${c.what} | ${String(c.from).replace(/\|/g, "\\|")} | ${String(c.to).replace(/\|/g, "\\|")} |`).join("\n") +
  "\n";
fs.writeFileSync("migration/reports/content-corrections.md", md);
console.log(`Wrote ${index.length} pages, ${corrections.length} corrections.`);
