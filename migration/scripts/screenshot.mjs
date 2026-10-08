// Usage: node screenshot.mjs <baseUrl> <outPrefix> <slug|/path> ... [--sizes=desktop,tablet,phone]
import { spawnSync } from "node:child_process";
import fs from "node:fs";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const SIZES = { desktop: [1440, 3200], tablet: [834, 3600], phone: [390, 4200] };
const [base, prefix, ...rest] = process.argv.slice(2);
const sizesArg = rest.find((a) => a.startsWith("--sizes="));
const sizes = sizesArg ? sizesArg.replace("--sizes=", "").split(",") : ["desktop", "phone"];
const paths = rest.filter((a) => !a.startsWith("--"));
fs.mkdirSync("migration/screens", { recursive: true });

for (const p of paths) {
  const urlPath = p === "home" ? "/" : p.startsWith("/") ? p : `/${p}/`;
  for (const s of sizes) {
    const [w, h] = SIZES[s];
    const out = `${process.cwd()}/migration/screens/${prefix}-${p === "home" ? "home" : p.replace(/\//g, "")}-${s}.png`;
    const r = spawnSync(
      EDGE,
      ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--window-size=${w},${h}`, "--virtual-time-budget=6000", `--screenshot=${out}`, base + urlPath],
      { encoding: "utf8", timeout: 90000 },
    );
    console.log(r.status, out);
  }
}
