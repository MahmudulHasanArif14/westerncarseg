import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "pages");
const PUBLIC_DIR = path.join(ROOT, "public");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const pageFiles = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".json")).sort();
const pages = pageFiles.map((file) => readJson(path.join(CONTENT_DIR, file)));
const staticRoutes = ["/", "/our-services/", "/about-us/", "/contact-us/", "/terms-conditions/"];
const routes = new Set([
  ...staticRoutes,
  ...pages.filter((page) => typeof page.path === "string").map((page) => page.path),
]);
const normalizeRoute = (value) => {
  const url = new URL(value, "https://westerncars.co.uk/");
  if (url.origin !== "https://westerncars.co.uk") return null;
  if (url.pathname === "/") return "/";
  return `${url.pathname.replace(/\/+$/, "")}/`;
};
const errors = [];
const warnings = [];
const reportPages = [];

for (const page of pages) {
  if (!page.path || !page.seo?.title || !page.seo?.description) {
    errors.push(`${page.slug || "unknown"} is missing path or SEO metadata`);
  }

  const html = [
    page.welcome?.tagline,
    ...(page.rows || []).flatMap((row) => (row.cols || []).flat()),
  ]
    .filter((block) => block?.type === "html")
    .map((block) => block.html)
    .join("\n");

  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]);
  const internalLinks = [];
  const brokenLinks = [];
  for (const href of hrefs) {
    if (/^(?:#|mailto:|tel:|javascript:)/i.test(href)) continue;
    const route = normalizeRoute(href);
    if (!route) continue;
    internalLinks.push(route);
    if (!routes.has(route)) brokenLinks.push(route);
  }
  if (brokenLinks.length) {
    errors.push(`${page.slug}: broken internal links: ${[...new Set(brokenLinks)].join(", ")}`);
  }

  const imagePaths = [...html.matchAll(/(?:src|data-src)=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((src) => src.startsWith("/images/"));
  for (const imagePath of imagePaths) {
    if (!fs.existsSync(path.join(PUBLIC_DIR, imagePath.slice(1)))) {
      errors.push(`${page.slug}: missing image ${imagePath}`);
    }
  }

  const h1Count = (html.match(/<h1\b/gi) || []).length + (page.hero?.h1 ? 1 : 0) + (page.h1 ? 1 : 0);
  if (h1Count !== 1) warnings.push(`${page.slug}: expected one H1, found ${h1Count}`);
  reportPages.push({
    slug: page.slug,
    path: page.path,
    title: page.seo?.title,
    description: page.seo?.description,
    h1Count,
    internalLinks: [...new Set(internalLinks)].sort(),
  });
}

const duplicate = (key) => {
  const groups = new Map();
  for (const page of reportPages) {
    const value = page[key];
    if (!value) continue;
    const list = groups.get(value) || [];
    list.push(page.slug);
    groups.set(value, list);
  }
  return [...groups.entries()].filter(([, slugs]) => slugs.length > 1);
};

for (const [title, slugs] of duplicate("title")) {
  warnings.push(`duplicate title "${title}" on ${slugs.join(", ")}`);
}
for (const [description, slugs] of duplicate("description")) {
  warnings.push(`duplicate description on ${slugs.join(", ")}`);
}

const expectedFiles = [
  "app/robots.ts",
  "app/sitemap.ts",
  "app/not-found.tsx",
  "public/llms.txt",
];
for (const file of expectedFiles) {
  if (!fs.existsSync(path.join(ROOT, file))) errors.push(`missing required SEO file ${file}`);
}

fs.mkdirSync(path.join(ROOT, "migration", "reports"), { recursive: true });
const report = {
  generatedAt: new Date().toISOString(),
  routeCount: routes.size,
  contentPageCount: pages.length,
  pages: reportPages,
  errors,
  warnings,
};
fs.writeFileSync(
  path.join(ROOT, "migration", "reports", "new-site-audit.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log(JSON.stringify({ routeCount: routes.size, contentPageCount: pages.length, errors, warnings }, null, 2));
if (errors.length) process.exitCode = 1;
