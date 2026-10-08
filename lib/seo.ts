import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/site";
import { image } from "@/lib/images";

interface PageMetadataInput {
  /** Full <title> text (not templated — titles are preserved from the WordPress site). */
  title: string;
  description: string;
  /** Canonical path with leading and trailing slash, e.g. "/gatwick-taxi/". */
  path: string;
  /** File name in /public/images. Defaults to the site's Open Graph image. */
  ogImage?: string;
  ogImageAlt?: string;
  noindex?: boolean;
}

/** Every indexable page gets canonical, robots, Open Graph and Twitter metadata from here. */
export function createPageMetadata({ title, description, path, ogImage, ogImageAlt, noindex = false }: PageMetadataInput): Metadata {
  const img = ogImage ? image(ogImage) : { src: `/images/${SITE.defaultOgImage.file}`, width: SITE.defaultOgImage.width, height: SITE.defaultOgImage.height };
  const url = absoluteUrl(path);
  const images = [{ url: absoluteUrl(img.src), width: img.width, height: img.height, alt: ogImageAlt ?? title }];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      title,
      description,
      url,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  };
}
