import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Page not found - Western Cars Crawley" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="wc-section" aria-labelledby="nf-heading">
      <div className="wc-row" style={{ textAlign: "center" }}>
        <h1 id="nf-heading" style={{ fontSize: 40, fontWeight: 600 }}>
          Page not found
        </h1>
        <p>Sorry, we couldn’t find that page. You can head back to the home page, see our services, or call us 24/7 on <a href={SITE.phone.tel}>{SITE.phone.display}</a>.</p>
        <p>
          <Link href="/">Home</Link> · <Link href="/our-services/">Our Services</Link> · <Link href="/contact-us/">Contact Us</Link>
        </p>
      </div>
    </section>
  );
}
