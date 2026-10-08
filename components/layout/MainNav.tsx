"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { NAV_ITEMS } from "@/lib/site";

/**
 * Blue sticky navigation bar. A real <ul> of links is always in the HTML (crawlable, works
 * without JS on desktop); the only client behaviour is the mobile menu toggle (<= 980px).
 */
export function MainNav() {
  const [open, setOpen] = useState(false);

  // Close the menu when the user navigates with a menu link or presses Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className="wc-nav" aria-label="Main" data-open={open}>
      <div className="wc-nav__row">
        <button type="button" className="wc-nav__toggle" aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen((o) => !o)}>
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
        <ul id="main-menu" className="wc-nav__list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
