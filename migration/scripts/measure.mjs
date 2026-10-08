// Usage: node measure.mjs <url> <width> "<css selector list separated by ;;>"  -> prints rect + key computed styles
import { launch } from "./cdp.mjs";

const [url, width, selectors] = process.argv.slice(2);
const b = await launch();
try {
  await b.open(url, Number(width), 900, Number(width) < 768);
  const out = await b.eval(`(() => {
    const sels = ${JSON.stringify(selectors.split(";;"))};
    return sels.map((s) => {
      const el = document.querySelector(s);
      if (!el) return { s, missing: true };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { s, x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height),
        font: cs.fontFamily.split(',')[0] + ' ' + cs.fontSize + '/' + cs.lineHeight + ' w' + cs.fontWeight, color: cs.color, bg: cs.backgroundColor,
        pad: cs.padding, mar: cs.margin, display: cs.display };
    });
  })()`);
  for (const o of out) console.log(JSON.stringify(o));
} finally {
  b.close();
}
