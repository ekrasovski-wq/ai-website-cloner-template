"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { play } from "@/lib/sounds";
import VariableProximity from "./VariableProximity";
import WiggleText from "./WiggleText";

function SocialIcon({ kind }: { kind: "instagram" | "x" | "behance" | "linkedin" }) {
  const common = "w-[18px] h-[18px]";
  switch (kind) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor">
          <path d="M18 2h3l-7.5 8.6L22 22h-6.4l-5-6.4L4.8 22H1.8l8-9.2L1.5 2H8l4.5 5.9L18 2z" />
        </svg>
      );
    case "behance":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor">
          <path d="M2.5 5h6.7c2.6 0 4.5 1.2 4.5 3.7 0 1.5-.7 2.5-1.9 3.1 1.6.5 2.5 1.7 2.5 3.5 0 2.8-2.3 4.2-5.1 4.2H2.5V5zm5.8 5.8c1.4 0 2.2-.6 2.2-1.7 0-1.2-.9-1.6-2.2-1.6H5.4v3.3h2.9zm.4 6.2c1.5 0 2.4-.6 2.4-1.9s-.9-1.9-2.5-1.9H5.4V17h3.3zM17 8h6v1.6h-6V8zm.3 8c-2.1 0-3.7-1.4-3.7-3.9s1.5-4.1 3.7-4.1c2.4 0 3.6 1.6 3.6 4.4v.4h-5.4c.1 1.2.9 1.8 1.9 1.8.8 0 1.4-.3 1.7-1l1.7.5c-.6 1.2-1.9 1.9-3.5 1.9zm-1.8-4.6h3.6c-.1-1.2-.7-1.8-1.7-1.8s-1.7.6-1.9 1.8z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor">
          <rect x="3" y="9" width="3.5" height="11" />
          <circle cx="4.75" cy="5.25" r="1.75" />
          <path d="M10 9h3.4v1.6c.6-1 1.9-1.9 3.6-1.9 3 0 4 1.9 4 4.6V20h-3.5v-5.7c0-1.4-.5-2.4-1.8-2.4-1.4 0-2 1-2 2.4V20H10V9z" />
        </svg>
      );
  }
}

/**
 * MorphingMenu — one shared morph element:
 *  - Closed: small white pill on top-right with "menu •"
 *  - Open : the white pill GROWS into a big right-anchored card with rounded corners
 *  - The little black dot • inside grows into the big black ✕ circle in the card's top-right
 */
export function MorphingMenu({
  open, setOpen,
}: { open: boolean; setOpen: (v: boolean) => void }) {
  const navRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const menuLabelRef = useRef<HTMLSpanElement>(null);
  // Suppresses link/footer hover sounds for a brief window right after the
  // menu opens — otherwise the morphing pill drags the cursor across the
  // newly-revealed links, triggering 2-3 stacked "click" sounds in a row.
  const justOpenedRef = useRef(false);

  // Stagger fade-in of contents when opened
  useEffect(() => {
    const containers = [navRef.current, footerRef.current].filter(Boolean) as HTMLElement[];
    const timers: number[] = [];
    containers.forEach((container) => {
      const els = container.querySelectorAll<HTMLElement>("[data-stagger]");
      els.forEach((el, i) => {
        if (open) {
          el.style.transition = `opacity 0.45s ease ${0.45 + i * 0.04}s, transform 0.55s cubic-bezier(0.2, 0.9, 0.2, 1) ${0.45 + i * 0.04}s`;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        } else {
          el.style.transitionDelay = "0s";
          el.style.transition = "opacity 0.2s ease, transform 0.2s ease";
          el.style.opacity = "0";
          el.style.transform = "translateY(8px)";
        }
      });
    });
    // Sound cascade — play "hover" for each social icon as it appears
    // when the menu opens. Skip the first stagger element (email link).
    if (open && footerRef.current) {
      const icons = footerRef.current.querySelectorAll<HTMLElement>("a[data-stagger]");
      icons.forEach((_, i) => {
        if (i === 0) return;  // skip email link
        const t = window.setTimeout(() => play("hover"), 450 + i * 90);
        timers.push(t);
      });
    }
    return () => { timers.forEach((t) => clearTimeout(t)); };
  }, [open]);

  // Sizes used by the morph. Closed pill has the same border-radius as the
  // open card (32px), but visually still LOOKS like a pill because the box
  // is short (32px radius on a 42px-tall box already rounds the ends fully).
  // This keeps the corners CONSTANT through the morph — no egg shape.
  const closedWidth = 92;      // slimmer pill width
  const closedHeight = 42;     // slimmer pill height — matches Pacome reference
  const openWidthCSS = "min(560px, calc(100vw - 60px))";
  const openHeightCSS = "calc(100vh - 48px)";

  // The little dot turns into the big ✕ circle
  const dotClosedSize = 8;
  const dotOpenSize = 36;

  return (
    <>
      {/* Click-outside backdrop. Slightly dims the page when menu is open. */}
      <div
        onClick={() => { play("close"); setOpen(false); }}
        className={`fixed inset-0 z-30 transition-colors duration-500 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{
          backgroundColor: open ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0)",
        }}
        aria-hidden
      />

      {/* The morphing container: pill -> card */}
      <button
        onClick={() => {
          if (!open) {
            play("menu/homelink");
            justOpenedRef.current = true;
            // Drop the hover-mute flag once the open animation has settled.
            setTimeout(() => { justOpenedRef.current = false; }, 700);
            setOpen(true);
          } else {
            play("close");
            setOpen(false);
          }
        }}
        onMouseEnter={() => { if (!open) play("hover"); }}
        aria-label={open ? "close menu" : "open menu"}
        className="fixed z-40 bg-white text-black overflow-hidden text-left"
        style={{
          top: "24px",
          right: "24px",
          width: open ? openWidthCSS : `${closedWidth}px`,
          height: open ? openHeightCSS : `${closedHeight}px`,
          borderRadius: "32px",
          boxShadow: open
            ? "0 30px 80px rgba(0,0,0,0.45)"
            : "0 4px 16px rgba(0,0,0,0.25)",
          cursor: open ? "default" : "pointer",
          transition: [
            "width 0.7s cubic-bezier(0.32, 0.72, 0, 1)",
            "height 0.7s cubic-bezier(0.32, 0.72, 0, 1)",
            "box-shadow 0.7s ease",
          ].join(","),
          willChange: "width, height",
        }}
      >
        {/* Hidden so clicking inside the open card does not collapse it */}
        {open && (
          <div
            className="absolute inset-0"
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* "menu" label with VariableProximity hover-weight effect.
            Pointer events kept ON so the cursor's screen position is tracked
            by the global mousemove listener that VariableProximity attaches. */}
        <span
          ref={menuLabelRef}
          className="absolute select-none text-[16px]"
          style={{
            top: open ? "30px" : "11px",
            right: open ? "82px" : "36px",
            opacity: open ? 0 : 1,
            color: "#000",
            position: "absolute",
            transition:
              "opacity 0.25s ease," +
              "top 0.6s cubic-bezier(0.6, 0.05, 0.1, 1)," +
              "right 0.6s cubic-bezier(0.6, 0.05, 0.1, 1)",
          }}
        >
          <WiggleText
            label="menu"
            style={{
              fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif',
              fontSize: "16px",
              fontWeight: 500,
              display: "inline-block",
            }}
          />
        </span>

        {/* "close" label — fades in slow when opening, fades out fast on close. */}
        <span
          className="absolute select-none pointer-events-none text-[16px]"
          style={{
            top: "30px",
            right: "82px",
            opacity: open ? 1 : 0,
            fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif',
            fontWeight: 500,
            fontVariationSettings: "'wght' 500, 'wdth' 100",
            color: "#000",
            transition: open
              ? "opacity 0.45s ease 0.25s"
              : "opacity 0.12s ease",
          }}
        >
          close
        </span>

        {/* The morphing DOT -> ✕ circle */}
        <div
          className="absolute bg-black rounded-full text-white flex items-center justify-center pointer-events-none"
          style={{
            width: open ? dotOpenSize : dotClosedSize,
            height: open ? dotOpenSize : dotClosedSize,
            top: open ? "24px" : `${(closedHeight - dotClosedSize) / 2}px`,
            right: open ? "24px" : "14px",
            transition: [
              "width 0.85s cubic-bezier(0.32, 0.72, 0, 1)",
              "height 0.85s cubic-bezier(0.32, 0.72, 0, 1)",
              "top 0.85s cubic-bezier(0.32, 0.72, 0, 1)",
              "right 0.85s cubic-bezier(0.32, 0.72, 0, 1)",
            ].join(","),
            willChange: "width, height, top, right",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              lineHeight: 1,
              opacity: open ? 1 : 0,
              transition: "opacity 0.55s ease 0.25s",
            }}
          >
            ✕
          </span>
        </div>

        {/* === Card content (only visible when open, click events allowed) === */}
        <div
          className="absolute inset-0"
          style={{
            pointerEvents: open ? "auto" : "none",
          }}
        >
          {/* Big nav links — plain large text */}
          <nav
            ref={navRef}
            className="absolute left-[44px] right-[44px] top-[42%] -translate-y-1/2 flex flex-col gap-1"
          >
            {[
              // All links share the same hover chime (matches the social icons).
              { href: "/works",   label: "works",   sound: "hover" as const },
              { href: "/about",   label: "about",   sound: "hover" as const },
              { href: "/contact", label: "contact", sound: "hover" as const },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                data-stagger
                style={{
                  opacity: 0,
                  transform: "translateY(8px)",
                  fontFamily: 'Indivisible, "Indivisible Variable", "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 500,
                  fontVariationSettings: "'wght' 500, 'wdth' 100",
                }}
                onMouseEnter={() => { if (!justOpenedRef.current) play(l.sound); }}
                onClick={() => play("click")}
                className="menu-nav-link group relative inline-flex items-center gap-4 text-[72px] leading-[1.05] tracking-tight hover:text-black transition-colors"
              >
                {/* Bullet pill — expands from 0 to a small rounded tab on
                    hover. Tracks the parent Link hover via Tailwind group. */}
                <span
                  aria-hidden
                  className="menu-bullet inline-block bg-black rounded-full transition-[width,opacity] duration-300 ease-out w-0 opacity-0 group-hover:w-[28px] group-hover:opacity-100"
                  style={{ height: "16px" }}
                />
                <span>{l.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer: email + socials. Stacks vertically on small screens so
              the social icons never overflow the card edge. */}
          <div
            ref={footerRef}
            className="absolute left-6 right-6 sm:left-[44px] sm:right-[28px] bottom-6 sm:bottom-[28px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <a
              href="mailto:Krasowskielene@gmail.com"
              data-stagger
              style={{ opacity: 0, transform: "translateY(8px)" }}
              onMouseEnter={() => { if (!justOpenedRef.current) play("hover"); }}
              className="text-[14px] text-black/80 hover:text-black"
            >
              Krasowskielene@gmail.com
            </a>
            <div className="flex items-center gap-3">
              {([
                ["instagram", "https://www.instagram.com/krasowski.jpg/"],
                ["behance", "https://www.behance.net/elenekrasovski"],
                ["linkedin", "https://www.linkedin.com/in/elene-krasovski-089b6821b/"],
              ] as const).map(([k, href]) => (
                <a
                  key={k}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-stagger
                  style={{ opacity: 0, transform: "translateY(8px)" }}
                  onMouseEnter={() => { if (!justOpenedRef.current) play("hover"); }}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black text-white flex items-center justify-center hover:scale-[1.06] transition-transform shrink-0"
                  aria-label={k}
                >
                  <SocialIcon kind={k} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </button>
    </>
  );
}

// Backwards-compatible exports so page.tsx works without changes
export function MenuButton(_: { open: boolean; setOpen: (v: boolean) => void }) {
  return null; // The morph is fully self-contained in MenuPanel now
}

export function MenuPanel({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return <MorphingMenu open={open} setOpen={setOpen} />;
}
