"use client";

/** Lets visitors re-open the consent dialog after their first choice. */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("wc:open-consent"))}
      style={{ background: "none", border: 0, padding: 0, font: "inherit", fontSize: 10, color: "#fff", textDecoration: "underline", cursor: "pointer" }}
    >
      Cookie settings
    </button>
  );
}
