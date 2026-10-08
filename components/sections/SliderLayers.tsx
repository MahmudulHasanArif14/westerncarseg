"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface SliderLayer {
  srcSet: string;
  src: string;
  sizes: string;
}

const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/**
 * Cross-fading background photos + dots for the desktop hero (auto-advances every 9s like the
 * original). Text content is rendered once, on the server, by <HeroSlider />.
 * Respects prefers-reduced-motion by not auto-advancing.
 */
export function SliderLayers({ layers, labels }: { layers: SliderLayer[]; labels: string[] }) {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => setActive((a) => (a + 1) % layers.length), 9000);
  }, [layers.length]);

  useEffect(() => {
    start();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [start]);

  return (
    <>
      {layers.map((layer, i) => (
        <div key={layer.src} className={`wc-slider__layer${i === active ? " is-active" : ""}`} aria-hidden="true">
          <picture>
            {/* Desktop-only: phones and tablets never download this hero photo. */}
            <source media="(min-width: 981px)" srcSet={layer.srcSet} sizes={layer.sizes} />
            <img src={BLANK} alt="" width={1920} height={1080} loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} decoding="async" />
          </picture>
        </div>
      ))}
      <div className="wc-slider__dots" role="group" aria-label="Choose background photo">
        {layers.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`wc-slider__dot${i === active ? " is-active" : ""}`}
            aria-label={labels[i]}
            aria-pressed={i === active}
            onClick={() => {
              setActive(i);
              start();
            }}
          />
        ))}
      </div>
    </>
  );
}
