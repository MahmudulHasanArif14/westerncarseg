// Minimal Divi shortcode parser (et_pb_* only).
const NUM = {
  8216: "‘", 8217: "’", 8220: "“", 8221: "”", 8211: "–", 8212: "—", 8230: "…", 8242: "′", 8243: "″", 38: "&amp;", 163: "£", 169: "©",
};

/** Convert numeric entities in HTML text to real characters (keeps &amp; etc. as HTML-safe). */
export function decodeText(s) {
  return s.replace(/&#(\d+);/g, (m, n) => NUM[Number(n)] ?? m);
}

/** Decode attribute values (plain strings, not HTML). */
export function decodeAttr(s) {
  return s
    .replace(/&#(\d+);/g, (m, n) => (Number(n) === 38 ? "&" : NUM[Number(n)] ?? m))
    .replace(/&amp;/g, "&");
}

const Q = String.raw`(?:&#8221;|&#8243;|&#8220;|")`;
const ATTR = String.raw`\s+[a-zA-Z_0-9]+=${Q}[\s\S]*?${Q}`;
const TOKEN = new RegExp(String.raw`\[(\/?)(et_pb_[a-z_0-9]+)((?:${ATTR})*)\s*(\/?)\]`, "g");

export function parseAttrs(str) {
  const out = {};
  const re = new RegExp(String.raw`([a-zA-Z_0-9]+)=${Q}([\s\S]*?)${Q}`, "g");
  for (const m of str.matchAll(re)) out[m[1]] = decodeAttr(m[2]);
  return out;
}

/** Remove the stray <p>/</p> fragments wpautop leaves around shortcodes. */
function cleanFragment(html) {
  return html
    .replace(/^\s*<\/p>\s*/i, "")
    .replace(/\s*<p>\s*$/i, "")
    .replace(/^\s*<br\s*\/?>\s*/i, "")
    .trim();
}

export function parse(raw) {
  const root = { tag: "root", attrs: {}, children: [] };
  const stack = [root];
  let last = 0;
  let m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(raw))) {
    const top = stack[stack.length - 1];
    const text = cleanFragment(raw.slice(last, m.index));
    if (text && text !== "<p>" && text !== "</p>") top.children.push({ tag: "#text", html: decodeText(text) });
    last = TOKEN.lastIndex;
    const [, closing, tag, attrStr, selfClose] = m;
    if (closing) {
      stack.pop();
    } else {
      const node = { tag, attrs: parseAttrs(attrStr), children: [] };
      top.children.push(node);
      if (!selfClose) stack.push(node);
    }
  }
  return root;
}

const KEEP = new Set([
  "background_image", "image", "button_url", "button_link", "button_text", "src", "alt", "title_text", "title_level", "header_level",
  "disabled_on", "column_structure", "button_alignment", "heading", "title", "type", "field_id", "field_title", "field_type", "email",
  "success_message", "submit_button_text", "url_new_window", "module_class", "required_mark", "fullwidth_field", "use_icon", "font_icon",
  "text_orientation",
]);

export function dump(node, depth = 0) {
  const pad = "  ".repeat(depth);
  if (node.tag === "#text") {
    const t = node.html.trim();
    return t ? `${pad}TEXT: ${t.replace(/\n+/g, " ⏎ ")}\n` : "";
  }
  const attrs = Object.entries(node.attrs).filter(([k]) => KEEP.has(k));
  let out = node.tag === "root" ? "" : `${pad}<${node.tag} ${attrs.map(([k, v]) => `${k}="${v}"`).join(" ")}>\n`;
  for (const c of node.children) out += dump(c, depth + 1);
  return out;
}
