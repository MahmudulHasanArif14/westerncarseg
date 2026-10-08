import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false } as const;

export const MenuIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={2.4} {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={2.4} {...p}>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M4 13l5 6L20 4" />
  </svg>
);

export const PinIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.8} {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const PhoneIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.8} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

export const MailIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.8} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

export const FacebookIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...p}>
    <path d="M14 8.5V6.9c0-.8.2-1.2 1.4-1.2H17V2.2C16.7 2.1 15.7 2 14.6 2 12.2 2 10.6 3.5 10.6 6.1v2.4H8v3.6h2.6V22H14v-9.9h2.6l.4-3.6H14z" />
  </svg>
);

export const WhatsAppIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.1 13.9c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .5.4l.7 1.7c.1.1.1.3 0 .4l-.3.5-.4.4c-.1.1-.2.3-.1.5.1.2.6 1 1.3 1.6.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.3.1.1.1.6-.1 1.2z" />
  </svg>
);
