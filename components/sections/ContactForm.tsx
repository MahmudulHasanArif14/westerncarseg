"use client";

import { useRef, useState } from "react";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok"; message: string } | { kind: "error"; message: string };
type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

const SUCCESS = "Thank you for your message, we’ll be in touch soon.";

/**
 * Contact form. Same fields as the WordPress (Divi) form — Your Name, Email Address, Phone, Subject,
 * Message — with real <label>s (visually hidden, the placeholders carry the visible text) and
 * inline validation. Posts JSON to /api/contact.
 */
export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const next: FieldErrors = {};
    if (!data.name?.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "")) next.email = "Please enter a valid email address.";
    if (!data.phone?.trim()) next.phone = "Please enter a phone number.";
    if (!data.message?.trim()) next.message = "Please enter a message.";
    setErrors(next);
    if (Object.keys(next).length) {
      formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(body.message || "Sorry, your message could not be sent. Please call us on 01293 300000.");
      formRef.current?.reset();
      setStatus({ kind: "ok", message: SUCCESS });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Sorry, something went wrong. Please call us on 01293 300000." });
    }
  }

  const invalid = (k: keyof FieldErrors) => (errors[k] ? true : undefined);

  return (
    <form ref={formRef} className="wc-form" onSubmit={onSubmit} noValidate aria-labelledby="contact-form-heading">
      <h2 id="contact-form-heading">Contact Us</h2>
      <div className="wc-form__fields">
        <div className="wc-form__field">
          <label htmlFor="cf-name" className="sr-only">
            Your Name (required)
          </label>
          <input id="cf-name" name="name" type="text" placeholder="Your Name" autoComplete="name" required aria-invalid={invalid("name")} aria-describedby={errors.name ? "cf-name-err" : undefined} />
          {errors.name ? (
            <p className="wc-form__error" id="cf-name-err">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="wc-form__field">
          <label htmlFor="cf-email" className="sr-only">
            Email Address (required)
          </label>
          <input id="cf-email" name="email" type="email" placeholder="Email Address" autoComplete="email" required aria-invalid={invalid("email")} aria-describedby={errors.email ? "cf-email-err" : undefined} />
          {errors.email ? (
            <p className="wc-form__error" id="cf-email-err">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div className="wc-form__field">
          <label htmlFor="cf-phone" className="sr-only">
            Phone (required)
          </label>
          <input id="cf-phone" name="phone" type="tel" placeholder="Phone" autoComplete="tel" required aria-invalid={invalid("phone")} aria-describedby={errors.phone ? "cf-phone-err" : undefined} />
          {errors.phone ? (
            <p className="wc-form__error" id="cf-phone-err">
              {errors.phone}
            </p>
          ) : null}
        </div>
        <div className="wc-form__field">
          <label htmlFor="cf-subject" className="sr-only">
            Subject
          </label>
          <input id="cf-subject" name="subject" type="text" placeholder="Subject" />
        </div>
        <div className="wc-form__field wc-form__field--full">
          <label htmlFor="cf-message" className="sr-only">
            Message (required)
          </label>
          <textarea id="cf-message" name="message" placeholder="Message" rows={5} required aria-invalid={invalid("message")} aria-describedby={errors.message ? "cf-message-err" : undefined} />
          {errors.message ? (
            <p className="wc-form__error" id="cf-message-err">
              {errors.message}
            </p>
          ) : null}
        </div>
        {/* honeypot — real visitors never see or fill this */}
        <div className="hp" aria-hidden="true">
          <label>
            Leave this field empty
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>
      <div className="wc-form__actions">
        <button className="wc-form__submit" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send Message"}
        </button>
      </div>
      <div role="status" aria-live="polite">
        {status.kind === "ok" ? <p className="wc-form__status wc-form__status--ok">{status.message}</p> : null}
        {status.kind === "error" ? <p className="wc-form__status wc-form__status--err">{status.message}</p> : null}
      </div>
    </form>
  );
}
