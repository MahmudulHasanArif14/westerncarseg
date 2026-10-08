// Tiny Chrome DevTools Protocol helper (Edge headless) — no dependencies, uses Node 22 global WebSocket.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

export async function launch(port = 9333) {
  const userDir = fs.mkdtempSync(path.join(os.tmpdir(), "edge-cdp-"));
  const proc = spawn(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", `--remote-debugging-port=${port}`, `--user-data-dir=${userDir}`, "about:blank"], { stdio: "ignore" });
  let targets;
  for (let i = 0; i < 50; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      if (targets.length) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    } else if (msg.method) listeners.forEach((l) => l(msg));
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const i = ++id;
      pending.set(i, { resolve, reject });
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  const api = {
    send,
    async open(url, width, height = 900, mobile = false) {
      await send("Page.enable");
      await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
      const loaded = new Promise((resolve) => {
        const l = (m) => {
          if (m.method === "Page.loadEventFired") {
            listeners.splice(listeners.indexOf(l), 1);
            resolve();
          }
        };
        listeners.push(l);
      });
      await send("Page.navigate", { url });
      await loaded;
      await new Promise((r) => setTimeout(r, 1800));
    },
    async eval(expression) {
      const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
      return r.result.value;
    },
    async screenshot(file, { fullPage = true } = {}) {
      let clip;
      if (fullPage) {
        const m = await send("Page.getLayoutMetrics");
        const { width, height } = m.cssContentSize || m.contentSize;
        clip = { x: 0, y: 0, width, height: Math.min(height, 12000), scale: 1 };
      }
      const r = await send("Page.captureScreenshot", { format: "png", clip, captureBeyondViewport: true });
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(r.data, "base64"));
    },
    close() {
      try {
        ws.close();
      } catch {}
      proc.kill();
    },
  };
  return api;
}
