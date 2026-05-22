"use client";

import { useState } from "react";
import Link from "next/link";
import { SmileyLogo } from "./SmileyLogo";

/**
 * Top-left brand mark: animated smiley orb + a hover-revealed "CIE CHIC" tag.
 * The tag is a yellow→green gradient star plus the "cie chic pertant" label,
 * matching the brand mark visible on pacomepertant.com.
 */
export function Logo() {
  const [hover, setHover] = useState(false);

  return (
    <Link
      href="/"
      className="fixed top-[26px] left-[26px] z-30 flex items-start gap-[14px]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Pacôme Pertant — Home"
    >
      <SmileyLogo size={62} spin />

      <div
        className="relative pointer-events-none transition-all duration-500"
        style={{
          opacity: hover ? 1 : 0,
          transform: hover ? "translateX(0)" : "translateX(-6px)",
          transitionTimingFunction: "cubic-bezier(0.22,0.61,0.36,1)",
        }}
      >
        <LogoTag />
      </div>
    </Link>
  );
}

function LogoTag() {
  return (
    <div
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Star */}
      <svg
        viewBox="0 0 74 71"
        width={36}
        height={34}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        style={{ marginRight: -10, zIndex: 2, position: "relative" }}
      >
        <defs>
          <linearGradient id="logo-star-grad" x1="7" x2="66" y1="65" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0.1" stopColor="#fdff6c" />
            <stop offset="1" stopColor="#28de91" />
          </linearGradient>
        </defs>
        <path
          fill="url(#logo-star-grad)"
          d="m73 31.4-23.9-.2c-.8 0-1.2-1-.5-1.5L71.3 13c.4-.3.4-.8.2-1.2L69 8.5a.9.9 0 0 0-1.2-.1L45.3 24.8a.9.9 0 0 1-1.3-1l7.4-22.6a.9.9 0 0 0-.8-1.1L45.7 0c-.4 0-.7.2-.8.6l-8 24a.9.9 0 0 1-1.6.3L23.7 8.2a.9.9 0 0 0-1.2-.3l-5 3.6c-.4.3-.5.8-.2 1.2l11.6 17c.4.5 0 1.3-.8 1.3l-25.4-.2c-.4 0-.7.2-.9.6l-1.8 5c-.1.6.3 1.2.9 1.2l24 .2c.8 0 1.2 1 .5 1.6L1.6 56.8c-.4.2-.5.8-.2 1.2l2.3 3.5c.2.4.8.5 1.2.2l23.7-17.4a.9.9 0 0 1 1.4 1l-8.2 24.4c-.1.6.3 1.1.9 1.1l5.2.1c.4 0 .8-.2.9-.6l8.5-25.9a.9.9 0 0 1 1.5-.2L50.9 62c.3.4.8.5 1.3.2l5-3.9c.5-.3.5-.8.3-1.2L45.2 39.4A.9.9 0 0 1 46 38l25.6.2c.4 0 .7-.2.8-.6l1.5-5a.9.9 0 0 0-.8-1.1Z"
        />
      </svg>

      {/* Tag pill */}
      <div
        style={{
          background: "#F8F8F8",
          color: "#0A0A0A",
          borderRadius: 28,
          padding: "0 24px 0 30px",
          height: 44,
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          fontSize: 16,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        cie chic pertant
      </div>
    </div>
  );
}
