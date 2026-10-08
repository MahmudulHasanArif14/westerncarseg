import Script from "next/script";
import { SITE } from "@/lib/site";

/**
 * Google tags with Consent Mode v2: everything defaults to "denied" (as the WordPress site's
 * cookie plugin did) and is upgraded only after the visitor chooses in <ConsentBanner />.
 * Loaded in production only so local development does not pollute analytics.
 */
export function Analytics() {
  if (process.env.NODE_ENV !== "production") return null;
  const { gtm, ga, ads } = SITE.analytics;

  return (
    <>
      <Script id="consent-default" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'denied',wait_for_update:500});
try{var c=JSON.parse(localStorage.getItem('wc-consent')||'null');if(c){gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.ads?'granted':'denied',ad_user_data:c.ads?'granted':'denied',ad_personalization:c.ads?'granted':'denied'});}}catch(e){}`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
      <Script id="gtag-config" strategy="afterInteractive">
        {`gtag('js',new Date());gtag('config','${ga}');gtag('config','${ads}');`}
      </Script>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
      </Script>
    </>
  );
}

export function AnalyticsNoScript() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${SITE.analytics.gtm}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
    </noscript>
  );
}
