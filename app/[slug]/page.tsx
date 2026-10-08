import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPageView } from "@/components/sections/LandingPageView";
import { getLandingPage, getLocationSlugs } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

/**
 * The 27 town/airport pages (e.g. /gatwick-taxi/, /taxi-service-in-east-grinstead/) share one
 * template and keep their original WordPress slugs. Anything not in the content set is a 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getLocationSlugs().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) return {};
  return createPageMetadata({ title: page.seo.title, description: page.seo.description, path: page.path });
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page || page.slug === "home") notFound();
  return <LandingPageView page={page} />;
}
