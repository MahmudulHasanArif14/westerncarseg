import type { NextConfig } from "next";

const config: NextConfig = {
  // WordPress URLs all end in "/" (e.g. /gatwick-taxi/). Keep them identical; the slash-less form 308-redirects.
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [55, 60, 65, 75],
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
  async redirects() {
    return [
      // --- WordPress leftovers (permanent) -------------------------------------------------
      { source: "/index.php", destination: "/", statusCode: 301 },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", statusCode: 301 },
      { source: "/page-sitemap.xml", destination: "/sitemap.xml", statusCode: 301 },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", statusCode: 301 },
      { source: "/geo-sitemap.xml", destination: "/sitemap.xml", statusCode: 301 },
      { source: "/locations.kml", destination: "/", statusCode: 301 },
      { source: "/feed", destination: "/", statusCode: 301 },
      { source: "/comments/feed", destination: "/", statusCode: 301 },
      { source: "/category/uncategorized", destination: "/", statusCode: 301 },

      // --- Media library URLs (kept so existing image links/search results keep working) ------
      // These four uploads were byte-identical copies of Taxi-Image.jpg.
      { source: "/wp-content/uploads/:y/:m/Airport-Taxi-Biggin-Hill.jpg", destination: "/images/Taxi-Image.jpg", statusCode: 301 },
      { source: "/wp-content/uploads/:y/:m/Airport-Taxi-London-City.jpg", destination: "/images/Taxi-Image.jpg", statusCode: 301 },
      { source: "/wp-content/uploads/:y/:m/Airport-Taxi-Luton.jpg", destination: "/images/Taxi-Image.jpg", statusCode: 301 },
      { source: "/wp-content/uploads/:y/:m/Airport-Taxi-Southend.jpg", destination: "/images/Taxi-Image.jpg", statusCode: 301 },
      { source: "/wp-content/uploads/:y/:m/cropped-Western-Cars-Favicon-:size.png", destination: "/icon.png", statusCode: 301 },
      { source: "/wp-content/uploads/:y/:m/:file", destination: "/images/:file", statusCode: 301 },

      // --- Canonical host: www -> apex ---------------------------------------------------------
      { source: "/:path*", has: [{ type: "host", value: "www.westerncars.co.uk" }], destination: "https://westerncars.co.uk/:path*", statusCode: 301 },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
    ];
  },
};

export default config;
