// Phase 1 audit of the live WordPress site. Output: migration/reports/old-site-inventory.{json,md}
import fs from "node:fs";

const ORIGIN = "https://westerncars.co.uk";
const pages = JSON.parse(fs.readFileSync("migration/source/pages.json", "utf8"));
const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;|&#038;/g, "&").replace(/&#8217;/g, "’").replace(/\s+/g, " ").trim();
const attr = (tag, name) => (tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i")) || [])[1];

const inventory = [];
for (const p of pages) {
  const html = fs.readFileSync(`migration/source/html/${p.slug}.html`, "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  const body = html.slice(html.indexOf("<body"));
  const clean = body.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  const headerHtml = (clean.match(/<header class="et-l et-l--header">[\s\S]*?<\/header>/) || [""])[0];
  const footerHtml = (clean.match(/<footer class="et-l et-l--footer">[\s\S]*?<\/footer>/) || [""])[0];
  const mainHtml = clean.replace(headerHtml, "").replace(footerHtml, "");

  const links = (frag) =>
    [...frag.matchAll(/<a\s[^>]*href=["']([^"']+)["'][^>]*>/g)].map((m) => m[1]);
  const norm = (u) => {
    try {
      const url = new URL(u, ORIGIN + "/");
      return url;
    } catch {
      return null;
    }
  };
  const classify = (list) => {
    const internal = new Set();
    const external = new Set();
    const other = new Set();
    for (const h of list) {
      if (/^(tel:|mailto:|#|javascript:)/i.test(h)) {
        other.add(h);
        continue;
      }
      const u = norm(h);
      if (!u) continue;
      if (u.hostname === "westerncars.co.uk" || u.hostname === "www.westerncars.co.uk") internal.add(u.origin.replace("www.", "") + u.pathname + u.search);
      else external.add(u.href);
    }
    return { internal: [...internal], external: [...external], other: [...other] };
  };

  const title = strip((head.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "");
  const desc = attr((head.match(/<meta name="description"[^>]*>/) || [""])[0], "content");
  const canonical = attr((head.match(/<link rel="canonical"[^>]*>/) || [""])[0], "href");
  const robots = attr((head.match(/<meta name='robots'[^>]*>/) || head.match(/<meta name="robots"[^>]*>/) || [""])[0], "content");
  const h1s = [...mainHtml.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => strip(m[1]));
  const h2s = [...mainHtml.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => strip(m[1]));
  const imgs = [...mainHtml.matchAll(/<img\s[^>]*>/g)].map((m) => ({ src: attr(m[0], "src"), alt: attr(m[0], "alt") ?? null, w: attr(m[0], "width"), h: attr(m[0], "height") }));
  const og = {
    image: attr((head.match(/<meta property="og:image"[^>]*>/) || [""])[0], "content"),
    title: attr((head.match(/<meta property="og:title"[^>]*>/) || [""])[0], "content"),
  };
  const jsonld = [...head.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const graphTypes = jsonld.flatMap((j) => {
    try {
      const g = JSON.parse(j)["@graph"] || [JSON.parse(j)];
      return g.map((n) => (Array.isArray(n["@type"]) ? n["@type"].join("+") : n["@type"]));
    } catch {
      return ["PARSE_ERROR"];
    }
  });
  inventory.push({
    slug: p.slug,
    url: p.slug === "home" ? `${ORIGIN}/` : `${ORIGIN}/${p.slug}/`,
    title,
    desc,
    canonical,
    robots,
    h1s,
    h2s,
    imgs,
    og,
    graphTypes,
    mainLinks: classify(links(mainHtml)),
    headerLinks: classify(links(headerHtml)),
    footerLinks: classify(links(footerHtml)),
    wordCount: strip(mainHtml).split(" ").length,
  });
}

// ---- Status checks for every distinct internal URL referenced + variants
const internalUrls = new Set(inventory.map((i) => i.url));
for (const i of inventory) for (const k of ["mainLinks", "headerLinks", "footerLinks"]) i[k].internal.forEach((u) => internalUrls.add(u));
const statuses = {};
for (const url of internalUrls) {
  const res = await fetch(url, { redirect: "manual" });
  statuses[url] = { status: res.status, location: res.headers.get("location") || undefined };
}
const variants = [
  `${ORIGIN}/our-services`,
  `${ORIGIN}/index.php`,
  `http://westerncars.co.uk/`,
  `https://www.westerncars.co.uk/`,
  `${ORIGIN}/gatwick-taxi`,
  `${ORIGIN}/?s=taxi`,
  `${ORIGIN}/feed/`,
  `${ORIGIN}/sitemap.xml`,
  `${ORIGIN}/wp-sitemap.xml`,
  `${ORIGIN}/does-not-exist/`,
  `${ORIGIN}/category/uncategorized/`,
  `${ORIGIN}/blog/`,
  `${ORIGIN}/brighton-taxi/`,
];
const variantResults = {};
for (const url of variants) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    variantResults[url] = { status: res.status, location: res.headers.get("location") || undefined };
  } catch (e) {
    variantResults[url] = { error: String(e) };
  }
}

// ---- Aggregate checks
const dupe = (arr) => {
  const m = {};
  arr.forEach(([k, v]) => (m[k] ||= []).push(v));
  return Object.entries(m).filter(([, v]) => v.length > 1);
};
const inboundContent = {};
const inboundAny = {};
for (const i of inventory) {
  for (const u of i.mainLinks.internal) (inboundContent[u] ||= new Set()).add(i.slug);
  for (const k of ["mainLinks", "headerLinks", "footerLinks"]) for (const u of i[k].internal) (inboundAny[u] ||= new Set()).add(i.slug);
}
const report = {
  total: inventory.length,
  duplicateTitles: dupe(inventory.map((i) => [i.title, i.slug])),
  duplicateDescriptions: dupe(inventory.map((i) => [i.desc, i.slug])),
  h1Counts: Object.fromEntries(inventory.map((i) => [i.slug, i.h1s.length])),
  missingH1: inventory.filter((i) => i.h1s.length === 0).map((i) => i.slug),
  multipleH1: inventory.filter((i) => i.h1s.length > 1).map((i) => ({ slug: i.slug, h1s: i.h1s })),
  duplicateH1: dupe(inventory.flatMap((i) => [...new Set(i.h1s)].map((h) => [h, i.slug]))),
  canonicalMismatch: inventory.filter((i) => i.canonical !== i.url).map((i) => ({ slug: i.slug, canonical: i.canonical })),
  noindex: inventory.filter((i) => /noindex/.test(i.robots || "")).map((i) => i.slug),
  orphansFromContent: inventory
    .filter((i) => !(inboundContent[i.url] && [...inboundContent[i.url]].some((s) => s !== i.slug)))
    .map((i) => i.slug),
  notInNavOrFooter: inventory
    .filter((i) => !(i.slug === "home") && !inventory.some((o) => [...o.headerLinks.internal, ...o.footerLinks.internal].includes(i.url)))
    .map((i) => i.slug),
  nonOkInternal: Object.entries(statuses).filter(([, s]) => s.status !== 200),
  imagesMissingAlt: inventory.flatMap((i) => i.imgs.filter((im) => !im.alt).map((im) => ({ slug: i.slug, src: im.src }))),
};

fs.mkdirSync("migration/reports", { recursive: true });
fs.writeFileSync("migration/reports/old-site-inventory.json", JSON.stringify({ inventory, statuses, variantResults, report }, null, 2));

// ---- Markdown table
const rows = inventory.map(
  (i) =>
    `| ${i.url.replace(ORIGIN, "") || "/"} | ${i.title} | ${i.h1s.length ? i.h1s.join(" ‖ ") : "—"} | ${i.imgs.length} | ${i.mainLinks.internal.length} | ${i.canonical === i.url ? "self" : i.canonical} | ${/noindex/.test(i.robots || "") ? "noindex" : "index,follow"} |`,
);
const md = `# Old site inventory (generated)\n\n| URL | Title | H1(s) | Imgs | Internal links in main | Canonical | Indexability |\n| --- | --- | --- | --- | --- | --- | --- |\n${rows.join("\n")}\n\n## Report\n\n\`\`\`json\n${JSON.stringify(report, null, 2)}\n\`\`\`\n\n## URL variants\n\n\`\`\`json\n${JSON.stringify(variantResults, null, 2)}\n\`\`\`\n`;
fs.writeFileSync("migration/reports/old-site-inventory.md", md);
console.log(JSON.stringify(report, null, 2));
console.log(JSON.stringify(variantResults, null, 2));
