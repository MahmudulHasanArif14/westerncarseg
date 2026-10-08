import Image from "next/image";
import { SITE } from "@/lib/site";
import { image } from "@/lib/images";

/** App Store / Google Play badges (both link to the iCabbi app landing page, as on the original). */
export function AppBadges({ order = "store-first", lazy = true }: { order?: "store-first" | "play-first"; lazy?: boolean }) {
  const store = image("Western-Cars-AppStore-App.png");
  const play = image("Western-Cars-Google-Play-App.png");
  const storeBadge = (
    <a key="store" href={SITE.links.app} target="_blank" rel="noopener noreferrer">
      <Image src={store.src} width={store.width} height={store.height} alt="Download the Western Cars app on the App Store" loading={lazy ? "lazy" : "eager"} />
    </a>
  );
  const playBadge = (
    <a key="play" href={SITE.links.app} target="_blank" rel="noopener noreferrer">
      <Image src={play.src} width={play.width} height={play.height} alt="Get the Western Cars app on Google Play" loading={lazy ? "lazy" : "eager"} />
    </a>
  );
  return <span className="wc-app__badges">{order === "store-first" ? [storeBadge, " ", playBadge] : [playBadge, " ", storeBadge]}</span>;
}
