import { SITE } from "@/lib/site";

/** "Book Your Taxi" / "Download Our App" panels — shown on phones only, as on the original. */
export function BookStrip() {
  return (
    <section className="wc-section wc-strip wc-only-phone" aria-label="Book your taxi or download the app">
      <div className="wc-row">
        <div className="wc-cols wc-cols--equal">
          <div className="wc-col wc-col--1-2 wc-strip__col">
            <p>Book Your Taxi</p>
            <div className="wc-btn-wrap">
              <a className="wc-btn wc-btn--outline wc-btn--rounded" href={SITE.links.booking} target="_blank" rel="noopener noreferrer">
                Book Now<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
          <div className="wc-col wc-col--1-2 wc-strip__col">
            <p>Download Our App</p>
            <div className="wc-btn-wrap">
              <a className="wc-btn wc-btn--outline wc-btn--rounded" href={SITE.links.app} target="_blank" rel="noopener noreferrer">
                Download<span className="sr-only"> the Western Cars app (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
