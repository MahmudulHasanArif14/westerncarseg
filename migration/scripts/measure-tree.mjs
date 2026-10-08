// Usage: node measure-tree.mjs <url> <width> -> prints rect of every section/row/column/module in main content
import { launch } from "./cdp.mjs";

const [url, width] = process.argv.slice(2);
const b = await launch();
try {
  await b.open(url, Number(width), 900, Number(width) < 768);
  const out = await b.eval(`(() => {
    const root = document.querySelector('#main-content');
    const els = [...root.querySelectorAll('.et_pb_section, .et_pb_row, .et_pb_column, .et_pb_module, .et_pb_text_inner > h1, .et_pb_text_inner > h2, .et_pb_text_inner > h3, .et_pb_text_inner > h4, .et_pb_blurb_container, .et_pb_contact_form_container, .et_pb_contact_field')];
    return els.map((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) return null;
      const cs = getComputedStyle(el);
      const cls = [...el.classList].filter(c => /^et_pb_(section|row|column|text|image|button|blurb|divider|heading|contact)_?\\d*(_\\d)?$/.test(c) || /^et_pb_(section|row|column|text|image|button|blurb|divider|heading|contact_form|contact_field)_\\d+$/.test(c)).join('.') || el.tagName.toLowerCase();
      return cls + ' | x' + Math.round(r.x) + ' y' + Math.round(r.y + scrollY) + ' w' + Math.round(r.width) + ' h' + Math.round(r.height) + ' | pad ' + cs.padding + ' mar ' + cs.margin + ' | ' + cs.fontSize + '/' + cs.fontWeight + ' ' + cs.fontFamily.split(',')[0] + ' ' + cs.color + ' ta:' + cs.textAlign;
    }).filter(Boolean);
  })()`);
  console.log(out.join("\n"));
} finally {
  b.close();
}
