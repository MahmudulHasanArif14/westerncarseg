import type { Metadata, Viewport } from "next";
import { Poppins, Raleway, Roboto } from "next/font/google";
import { Analytics, AnalyticsNoScript } from "@/components/consent/Analytics";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { Footer } from "@/components/layout/Footer";
import { MainNav } from "@/components/layout/MainNav";
import { TopBar } from "@/components/layout/TopBar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/schemas";
import { SITE } from "@/lib/site";
import "./globals.css";

const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], display: "swap", variable: "--font-raleway" });
// Roboto is only used for the header phone number; the original asked for weight 800, which Roboto
// does not ship, so browsers rendered the 900 face.
const roboto = Roboto({ subsets: ["latin"], weight: ["900"], display: "swap", variable: "--font-roboto" });
// Poppins is only used by the contact form.
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-poppins" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: { default: "Western Cars Crawley Taxis, West Sussex - Local Taxi Crawley", template: "%s" },
  description: "Reliable, affordable 24 hour taxi service in Crawley, West Sussex.",
  formatDetection: { telephone: false },
  verification: { google: SITE.googleSiteVerification },
  other: { "geo.placename": "Crawley", "geo.region": "GB-WSX" },
};

// The original set `maximum-scale=1, user-scalable=0`, which blocks pinch-zoom (WCAG 1.4.4). Dropped.
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#3c58a2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.lang} className={`${raleway.variable} ${roboto.variable} ${poppins.variable}`}>
      <body>
        <AnalyticsNoScript />
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <TopBar />
        <MainNav />
        <main id="main">{children}</main>
        <Footer />
        <ConsentBanner />
        <WhatsAppButton />
        <OrganizationSchema />
        <WebSiteSchema />
        <Analytics />
      </body>
    </html>
  );
}
