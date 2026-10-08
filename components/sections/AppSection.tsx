import Image from "next/image";
import { AppBadges } from "@/components/ui/AppBadges";
import { BgImage } from "@/components/ui/BgImage";
import { image } from "@/lib/images";

/** "Download Our Smartphone App" promo (copy unchanged from WordPress, typos included). */
export function AppSection() {
  const phone = image("Western-Cars-Mobile-App.png");
  return (
    <section className="wc-section wc-app" aria-labelledby="app-heading">
      <BgImage file="Phone-App-Background.jpg" quality={55} />
      <div className="wc-row">
        <div className="wc-cols wc-cols--equal wc-cols--center">
          <div className="wc-col wc-col--1-2">
            <h2 id="app-heading" className="wc-module">
              Download Our Smartphone App
            </h2>
            <p className="wc-module">
              You can always book your cab via our site, email or phone number but do you know we have also launched Wester Cars free Iphone and Andorid app? So, We are pleased to announce that we have launched
              our mobile app for the Android and IOS Platform. You book through these apps on your Android or iPhone smartphone, Select from the below app stores to download. You can also go directly to our
              website through your mobile web browser to book through our user friendly booking engine.
            </p>
            <p className="wc-module">
              <AppBadges order="play-first" />
            </p>
          </div>
          <div className="wc-col wc-col--1-2 wc-app__phone">
            <Image src={phone.src} width={phone.width} height={phone.height} alt="Western Cars mobile app" sizes="(max-width: 980px) 80vw, 375px" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
