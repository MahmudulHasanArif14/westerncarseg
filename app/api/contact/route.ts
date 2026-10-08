import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";

/**
 * Contact form endpoint. Validates input, drops honeypot submissions, applies a light per-IP rate
 * limit and e-mails the message through the Resend HTTP API (no SDK dependency).
 *
 * Required env: RESEND_API_KEY, CONTACT_FROM_EMAIL (verified sender). Optional: CONTACT_TO_EMAIL.
 * If they are missing the endpoint answers 503 with a message telling the visitor to phone instead,
 * so enquiries are never silently lost.
 */
export const runtime = "nodejs";

const MAX = { name: 120, email: 254, phone: 40, subject: 200, message: 5000 };
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ message: `Too many messages — please call us on ${SITE.phone.display}.` }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots do not retry.
  if (clean(body.website, 50)) return NextResponse.json({ ok: true });

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const phone = clean(body.phone, MAX.phone);
  const subject = clean(body.subject, MAX.subject);
  const message = clean(body.message, MAX.message);

  if (!name || !phone || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Please fill in your name, a valid email address, phone number and message." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || SITE.email;
  if (!apiKey || !from) {
    console.error("[contact] RESEND_API_KEY / CONTACT_FROM_EMAIL not configured — message not delivered");
    return NextResponse.json({ message: `Sorry, online messages are temporarily unavailable. Please call us on ${SITE.phone.display} or email ${SITE.email}.` }, { status: 503 });
  }

  const html = `<p><strong>New website enquiry</strong></p>
<table cellpadding="6">
<tr><td><strong>Name</strong></td><td>${esc(name)}</td></tr>
<tr><td><strong>Email</strong></td><td>${esc(email)}</td></tr>
<tr><td><strong>Phone</strong></td><td>${esc(phone)}</td></tr>
<tr><td><strong>Subject</strong></td><td>${esc(subject || "(none)")}</td></tr>
</table>
<p style="white-space:pre-wrap">${esc(message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Website enquiry${subject ? `: ${subject}` : ""} — ${name}`,
      html,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject || "(none)"}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ message: `Sorry, your message could not be sent. Please call us on ${SITE.phone.display}.` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
