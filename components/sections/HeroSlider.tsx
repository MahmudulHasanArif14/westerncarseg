import Image, { getImageProps } from "next/image";
import { AppBadges } from "@/components/ui/AppBadges";
import { SliderLayers, type SliderLayer } from "@/components/sections/SliderLayers";
import type { LandingPage } from "@/lib/content-types";
import { image } from "@/lib/images";
import { SITE } from "@/lib/site";

const BLURB = "Book a cab on the go or use our online service. Compare the prices, choose the best and book your cab. 24/7 customer support.";

/**
 * Desktop hero (visible >= 981px — hidden on tablet/phone exactly like the original).
 * One H1, one copy of the text; only the background photos rotate.
 */
export function HeroSlider({ page }: { page: LandingPage }) {
  const layers: SliderLayer[] = page.hero.backgrounds.map((file) => {
    const img = image(file);
    const { props } = getImageProps({ src: img.src, alt: "", width: img.width, height: img.height, sizes: "100vw", quality: 60 });
    return { srcSet: props.srcSet ?? "", src: props.src, sizes: "100vw" };
  });
  const phone = image("Western-Cars-Mobile-App.png");

  return (
    <section className="wc-slider wc-only-desktop" aria-label={`${page.city} taxi hire`}>
      <SliderLayers layers={layers} labels={layers.map((_, i) => `Show background photo ${i + 1} of ${layers.length}`)} />
      <div className="wc-slider__slide">
        <div className="wc-slider__container">
          <div className="wc-slider__description">
            <h1 className="wc-slider__title">{page.hero.h1}</h1>
            <div className="wc-slider__content">
              <h2>{page.hero.h2}</h2>
              <p>{BLURB}</p>
              <p>
                <a href={SITE.phone.tel}>
                  <strong>
                    CALL US 24/7 : <span>{SITE.phone.display}</span>
                  </strong>
                </a>
              </p>
              <p>
                <AppBadges lazy={false} />
              </p>
            </div>
            <a className="wc-slider__button" href={SITE.links.booking} target="_blank" rel="noopener noreferrer">
              Book Online Now<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <div className="wc-slider__image">
            <Image src={phone.src} width={phone.width} height={phone.height} alt="Western Cars taxi booking app on a smartphone" sizes="375px" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
