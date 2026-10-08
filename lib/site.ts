/**
 * Single source of truth for business facts (NAP + entity data).
 * Every value here was taken from the live WordPress site (footer, Yoast schema, T&Cs).
 * Do not add facts that are not published on the original site.
 */
export const SITE = {
  name: "Western Cars Crawley",
  shortName: "Western Cars",
  legalName: "Western Cars Private Hire Limited",
  companyNumber: "09243357",
  companyRegisteredIn: "England & Wales",
  /** Footer: "Western Cars was formed in 2007 …" */
  foundingYear: "2007",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://westerncars.co.uk").replace(/\/$/, ""),
  locale: "en_GB",
  lang: "en-GB",
  tagline: "Crawley Taxi Hire",
  phone: {
    display: "01293 300000",
    /** E.164 — the WordPress Yoast schema had this wrong ("440129330000"). */
    e164: "+441293300000",
    tel: "tel:+441293300000",
  },
  email: "info@westerncars.co.uk",
  address: {
    streetAddress: "198 Haslett Avenue, Three Bridges",
    locality: "Crawley",
    region: "West Sussex",
    postalCode: "RH10 1LY",
    country: "GB",
    /** As printed in the site footer. */
    oneLine: "198 Haslett Avenue, Three Bridges, Crawley, RH10 1LY",
  },
  /** "Call Us 24/7" / "24 hour service 7 days a week". */
  hours: { label: "24 hours a day, 7 days a week", opens: "00:00", closes: "23:59" },
  links: {
    booking: "https://westerncars.webbooker.icabbi.com/",
    bookingLegacy: "https://book.icabbidispatch.com/b9f04b22390a5018054c430ef23b609bbb842f6a/public/login",
    app: "https://icab.bi/Western",
    facebook: "https://www.facebook.com/westerncarscrawley",
    siteBuilder: "https://www.blinkweb.co.uk",
  },
  /** Only genuine official profiles. */
  sameAs: ["https://www.facebook.com/westerncarscrawley"],
  logo: { file: "Western-Cars-Taxi-Logo-No-URL.png", width: 340, height: 201, alt: "Western Cars Taxi" },
  defaultOgImage: { file: "Western-Cars-Crawley-Taxi-Service.jpg", width: 1080, height: 1080 },
  googleSiteVerification: "pwye61dhpevQ1C_tuziGZ2qWJeypdXK7UfPNwKiuuHY",
  maps: {
    embed:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10017.890197842538!2d-0.1615273!3d51.1181911!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4875f105d8dbc0eb%3A0xf52ef28cace469bb!2sWestern%20Cars%20Crawley!5e0!3m2!1sen!2suk!4v1707819138821!5m2!1sen!2suk",
  },
  /** Sister sites shown in the original header top-bar. */
  siblingSites: [
    { label: "East Grinstead", href: "https://westerncars-eastgrinstead.co.uk" },
    { label: "Haywards Heath", href: "https://westerncars-haywardsheath.co.uk" },
    { label: "Horley", href: "https://westerncars-horley.co.uk" },
    { label: "Horsham", href: "https://westerncars-horsham.co.uk" },
    { label: "Worthing", href: "https://westerncars.com/" },
  ],
  analytics: {
    gtm: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-TG87NWM",
    ga: process.env.NEXT_PUBLIC_GA_ID ?? "G-9TV8JQCRVJ",
    ads: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "AW-998265440",
  },
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
} as const;

export const absoluteUrl = (path: string) => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

/** Main navigation (original WordPress "Menu"). */
export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/our-services/" },
  { label: "About Us", href: "/about-us/" },
  { label: "Contact Us", href: "/contact-us/" },
  { label: "Terms & Conditions", href: "/terms-conditions/" },
] as const;

/** Footer "Links" column (original order). */
export const FOOTER_LINKS = [
  { label: "Book Now", href: SITE.links.booking, external: true },
  { label: "Our Services", href: "/our-services/" },
  { label: "Contact", href: "/contact-us/" },
  { label: "Terms & Conditions", href: "/terms-conditions/" },
] as const;
