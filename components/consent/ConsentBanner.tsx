"use client";

import { useEffect, useState } from "react";

type Choice = { analytics: boolean; ads: boolean };
const KEY = "wc-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function apply(choice: Choice) {
  try {
    localStorage.setItem(KEY, JSON.stringify(choice));
  } catch {
    /* storage unavailable (private mode) — choice only lasts for this page view */
  }
  window.gtag?.("consent", "update", {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: choice.ads ? "granted" : "denied",
    ad_user_data: choice.ads ? "granted" : "denied",
    ad_personalization: choice.ads ? "granted" : "denied",
  });
}

/** Cookie consent: Accept all / Reject all / Customize — same three choices as the WordPress site. */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [choice, setChoice] = useState<Choice>({ analytics: false, ads: false });

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage must happen after mount
    if (!stored) setVisible(true);
    const reopen = () => {
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener("wc:open-consent", reopen);
    return () => window.removeEventListener("wc:open-consent", reopen);
  }, []);

  if (!visible) return null;

  const decide = (c: Choice) => {
    apply(c);
    setVisible(false);
    setCustomizing(false);
  };

  return (
    <div className="wc-consent" role="dialog" aria-modal="false" aria-labelledby="consent-title">
      <h2 id="consent-title">We value your privacy</h2>
      {customizing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            decide(choice);
          }}
        >
          <fieldset>
            <legend className="sr-only">Cookie preferences</legend>
            <label>
              <input type="checkbox" checked disabled /> <span>Necessary — always active (keeps the site working).</span>
            </label>
            <label>
              <input type="checkbox" checked={choice.analytics} onChange={(e) => setChoice({ ...choice, analytics: e.target.checked })} /> <span>Analytics — helps us understand how the site is used.</span>
            </label>
            <label>
              <input type="checkbox" checked={choice.ads} onChange={(e) => setChoice({ ...choice, ads: e.target.checked })} /> <span>Advertising — personalised ads and measurement.</span>
            </label>
          </fieldset>
          <div className="wc-consent__actions">
            <button type="submit" className="primary">
              Save my choices
            </button>
          </div>
        </form>
      ) : (
        <>
          <p>We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.</p>
          <div className="wc-consent__actions">
            <button type="button" onClick={() => setCustomizing(true)}>
              Customize
            </button>
            <button type="button" onClick={() => decide({ analytics: false, ads: false })}>
              Reject All
            </button>
            <button type="button" className="primary" onClick={() => decide({ analytics: true, ads: true })}>
              Accept All
            </button>
          </div>
        </>
      )}
    </div>
  );
}
