import Image from "next/image";
import type { ReactNode } from "react";
import { BgImage } from "@/components/ui/BgImage";
import { image } from "@/lib/images";

export const USPS = [
  { file: "Why-Choose-Us.png", alt: "Why Choose Western Cars", title: "Why Choose Us?", text: "Western Cars are fully licensed Minicab Service, Our prices are very competitive as we are the providers of one of the cheapest rates on the market." },
  { file: "247-Taxi-Service.png", alt: "24/7 taxi service", title: "24/7 Taxi Service", text: "Excellent customer services department. We take any complaints or comments personally." },
  { file: "Services.png", alt: "Taxi services", title: "Services", text: "At Western Cars we provide all Private car or Private taxi services." },
] as const;

export function Usp({ usp }: { usp: (typeof USPS)[number] }) {
  const img = image(usp.file);
  return (
    <div className="wc-usp">
      <Image className="wc-usp__icon" src={img.src} width={img.width} height={img.height} alt={usp.alt} loading="lazy" />
      <h3>{usp.title}</h3>
      <p>{usp.text}</p>
    </div>
  );
}

/**
 * Landing-page variant: three USPs on the left, a photo on the right (phone/desktop only).
 * Children (the "Areas We Cover" rows) sit in the same full-bleed section, as on the original.
 */
export function WhyChooseUsLanding({ children }: { children?: ReactNode }) {
  return (
    <section className="wc-section wc-why" aria-label="Why choose Western Cars">
      <div className="wc-row wc-why__row">
        <div className="wc-cols wc-cols--equal">
          <div className="wc-col wc-col--1-2 wc-why__left">
            {USPS.map((u) => (
              <Usp key={u.title} usp={u} />
            ))}
          </div>
          <div className="wc-col wc-col--1-2 wc-why__right">
            <BgImage file="Chauffering-Hire.jpg" sizes="(max-width: 767px) 100vw, 50vw" quality={65} />
            <span className="sr-only">Group taxi</span>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}

/** Inner-page variant: three columns over a faded photo with an arched top edge. */
export function WhyChooseUsBand() {
  return (
    <section className="wc-section wc-band" aria-label="Why choose Western Cars">
      <BgImage file="Western-Cards-Mercedes.jpg" quality={55} />
      <div className="wc-row wc-row--wide">
        <div className="wc-cols wc-cols--equal">
          {USPS.map((u) => (
            <div key={u.title} className="wc-col wc-col--1-3">
              <Usp usp={u} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
