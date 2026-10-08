import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

/** Logo, 24/7 phone number and the "other Western Cars locations" links — as in the original header. */
export function TopBar() {
  return (
    <header className="wc-header-top">
      <div className="wc-header-top__row">
        <div className="wc-header-top__logo">
          <Link href="/" aria-label={`${SITE.name} — home`}>
            <Image src={`/images/${SITE.logo.file}`} width={SITE.logo.width} height={SITE.logo.height} alt={SITE.logo.alt} priority sizes="(min-width: 981px) 148px, 340px" />
          </Link>
        </div>
        <div className="wc-header-top__info">
          <p className="wc-header-phone">
            <a href={SITE.phone.tel}>
              Call Us 24/7 : <span>{SITE.phone.display}</span>
            </a>
          </p>
          <nav className="wc-sister-nav" aria-label="Western Cars locations">
            <ul>
              <li>
                <Link href="/" aria-current="page">
                  Crawley
                </Link>
              </li>
              {SITE.siblingSites.map((s) => (
                <li key={s.href}>
                  <a href={s.href} {...(s.href.includes("westerncars.com") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
