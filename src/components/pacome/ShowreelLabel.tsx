"use client";

import Image from "next/image";

const MARQUEE_TEXT = "showreel • 2025 • ".repeat(6);

/**
 * Bottom-left thumbnail with a rotating "showreel • 2025" marquee around it,
 * exactly like the original site.
 */
export function ShowreelLabel() {
  return (
    <button
      type="button"
      aria-label="Watch showreel"
      className="group fixed bottom-[26px] left-[26px] z-30 w-[150px] h-[150px] flex items-center justify-center select-none"
    >
      {/* Rotating circular text */}
      <div
        className="absolute inset-0"
        style={{ animation: "slow-rotate 22s linear infinite" }}
      >
        <svg viewBox="-80 -80 160 160" className="w-full h-full" aria-hidden>
          <defs>
            <path
              id="reel-circle"
              d="M 0,-66 A 66,66 0 1,1 0,66 A 66,66 0 1,1 0,-66"
              fill="none"
            />
          </defs>
          <text
            fill="#FAFAFA"
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "lowercase",
            }}
          >
            <textPath href="#reel-circle">{MARQUEE_TEXT}</textPath>
          </text>
        </svg>
      </div>

      {/* Thumbnail */}
      <div
        className="relative w-[80px] h-[80px] rounded-[12px] overflow-hidden transition-transform duration-500 group-hover:scale-105"
        style={{ transform: "rotate(-6deg)" }}
      >
        <Image
          src="/images/reel-thumbnail.png"
          alt=""
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
    </button>
  );
}
