import fs from "node:fs";

function dims(buf) {
  if (buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), type: "png" };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7), type: "jpg" };
      }
      i += 2 + len;
    }
  }
  return null;
}
const out = {};
for (const f of fs.readdirSync("public/images").sort()) {
  const buf = fs.readFileSync(`public/images/${f}`);
  const d = dims(buf);
  out[f] = { ...d, bytes: buf.length };
  console.log(f.padEnd(42), d ? `${d.w}x${d.h}` : "?", `${Math.round(buf.length / 1024)}KB`);
}
fs.writeFileSync("migration/reports/image-dimensions.json", JSON.stringify(out, null, 2));
