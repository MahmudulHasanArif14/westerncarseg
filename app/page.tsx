import type { Metadata } from "next";
import { LandingPageView } from "@/components/sections/LandingPageView";
import { getLandingPage } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const homePage = getLandingPage("home");
if (!homePage) throw new Error("home content missing — run `npm run content`");
const page = homePage;

export const metadata: Metadata = createPageMetadata({ title: page.seo.title, description: page.seo.description, path: "/" });

export default function HomePage() {
  return <LandingPageView page={page} />;
}
