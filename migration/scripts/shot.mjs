// Usage: node shot.mjs <url> <out.png> <width> [clipY] [clipH]  -- exact-width screenshot via CDP (optionally a vertical slice)
import { launch } from "./cdp.mjs";
import fs from "node:fs";
import path from "node:path";

const [url, out, width, clipY, clipH] = process.argv.slice(2);
const b = await launch();
try {
  await b.open(url, Number(width), 900, Number(width) < 768);
  // hide cookie banner + chat widget so they don't cover content
  await b.eval(`(() => { document.querySelectorAll('.cky-consent-container, .cky-overlay, #wa, .nta-wa-gdpr-popup, .wc-consent, .wc-wa').forEach(e => e.style.display='none'); })()`);
  const m = await b.send("Page.getLayoutMetrics");
  const full = m.cssContentSize || m.contentSize;
  const y = clipY ? Number(clipY) : 0;
  const h = clipH ? Number(clipH) : Math.min(full.height, 12000);
  const r = await b.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y, width: Number(width), height: h, scale: 1 }, captureBeyondViewport: true });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(r.data, "base64"));
  console.log("saved", out, `${width}x${h}`, "page height", full.height);
} finally {
  b.close();
}
