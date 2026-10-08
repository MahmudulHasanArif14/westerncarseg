import Image from "next/image";
import { image } from "@/lib/images";

/**
 * Decorative full-bleed photo behind a section (replaces CSS background-image so it is
 * resized, converted to AVIF/WebP and lazy-loaded by next/image).
 * Parent must be `position: relative` (all .wc-section elements are).
 */
export function BgImage({ file, sizes = "100vw", priority = false, quality = 60 }: { file: string; sizes?: string; priority?: boolean; quality?: number }) {
  const img = image(file);
  return <Image className="wc-bg" src={img.src} alt="" fill sizes={sizes} quality={quality} priority={priority} loading={priority ? undefined : "lazy"} aria-hidden="true" />;
}
