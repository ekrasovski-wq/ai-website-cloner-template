"use client";
// Smiley logo extracted verbatim from pacomepertant.com:
//   - 5 Lottie animations (face1, face2, face3, face4, face5) recovered from
//     their bundled JS at line 4179. They cycle face1 → face3 → face4 → face5
//     on each click; face2 is unused on the original site.
//   - SVG "click!!" speech-bubble + yellow/green star are also their exact
//     paths (data-v-e06c1417 from the bundle).
//
// On hover: bubble appears with a bounce. On click: next face animation
// plays once; a smiley sound plays.

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import { play, playRandomSmiley } from "@/lib/sounds";

// Lottie player needs to be client-only.
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import face1 from "@/data/faces/face1.json";
import face3 from "@/data/faces/face3.json";
import face4 from "@/data/faces/face4.json";
import face5 from "@/data/faces/face5.json";

// Pacome cycles through these 4 faces (face2 is intentionally skipped on
// their site — see line 4188 of their bundle).
const FACES = [face1, face3, face4, face5];

export function Logo3D({ size = 96, onClick }: { size?: number; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [faceIndex, setFaceIndex] = useState(0);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  const handleClick = () => {
    const next = (faceIndex + 1) % FACES.length;
    setFaceIndex(next);
    // Play matching smiley sound, exactly as the original.
    play(`smiley/smiley${next + 1}` as "smiley/smiley1");
    // Restart the lottie animation from frame 0.
    lottieRef.current?.stop();
    lottieRef.current?.play();
    onClick?.();
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => { setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <div
        style={{
          width: size,
          height: size,
          filter: "drop-shadow(0 6px 24px rgba(70, 240, 130, 0.25))",
          animation: "logoFloat 6s ease-in-out infinite",
          cursor: "pointer",
        }}
        className="select-none"
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={FACES[faceIndex]}
          loop={false}
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* HeaderLogoTag from Pacome — verbatim SVG paths */}
      <div
        className="select-none pointer-events-none"
        style={{
          position: "absolute",
          left: size * 1.05,
          top: size * 0.2,
          width: size * 1.2,
          height: size * 0.65,
          opacity: hovered ? 1 : 0,
          transform: hovered
            ? "translateX(0) scale(1)"
            : "translateX(-6px) scale(0.85)",
          transformOrigin: "left center",
          transition:
            "opacity 0.18s ease, transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 74 70.9"
          style={{
            position: "absolute",
            right: -size * 0.04,
            top: -size * 0.12,
            width: size * 0.32,
            height: size * 0.3,
            zIndex: 2,
          }}
        >
          <defs>
            <linearGradient id="logoTagGrad" x1="7.2" x2="66.4" y1="65.1" y2="5.9" gradientUnits="userSpaceOnUse">
              <stop offset=".1" stopColor="#fdff6c" />
              <stop offset="1" stopColor="#28de91" />
            </linearGradient>
          </defs>
          <path
            fill="url(#logoTagGrad)"
            d="m73 31.4-23.9-.2c-.8 0-1.2-1-.5-1.5L71.3 13c.4-.3.4-.8.2-1.2L69 8.5a.9.9 0 0 0-1.2-.1L45.3 24.8a.9.9 0 0 1-1.3-1l7.4-22.6a.9.9 0 0 0-.8-1.1L45.7 0c-.4 0-.7.2-.8.6l-8 24a.9.9 0 0 1-1.6.3L23.7 8.2a.9.9 0 0 0-1.2-.3l-5 3.6c-.4.3-.5.8-.2 1.2l11.6 17c.4.5 0 1.3-.8 1.3l-25.4-.2c-.4 0-.7.2-.9.6l-1.8 5c-.1.6.3 1.2.9 1.2l24 .2c.8 0 1.2 1 .5 1.6L1.6 56.8c-.4.2-.5.8-.2 1.2l2.3 3.5c.2.4.8.5 1.2.2l23.7-17.4a.9.9 0 0 1 1.4 1l-8.2 24.4c-.1.6.3 1.1.9 1.1l5.2.1c.4 0 .8-.2.9-.6l8.5-25.9a.9.9 0 0 1 1.5-.2L50.9 62c.3.4.8.5 1.3.2l5-3.9c.5-.3.5-.8.3-1.2L45.2 39.4A.9.9 0 0 1 46 38l25.6.2c.4 0 .7-.2.8-.6l1.5-5a.9.9 0 0 0-.8-1.1Z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 157.2 59.6"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: size * 1.2,
            height: size * 0.46,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))",
          }}
        >
          <g>
            <path fill="#f8f8f8" d="M130 59.6H0l16.7-46.4A20 20 0 0 1 35.6 0H137A20 20 0 0 1 156 26.9l-7 19.4a20 20 0 0 1-19 13.3Z" />
            <path d="M39.7 22.7c5.2 0 8.5 3.2 9.1 7.6H44c-.6-1.9-2-3.3-4.2-3.3-3.1 0-4.8 2.7-4.8 5.7s1.7 5.8 4.8 5.8c2.3 0 3.6-1.5 4.2-3.4h4.8c-.6 4.4-4 7.6-9 7.6-6 0-9.8-4.6-9.8-10s3.8-10 9.7-10ZM52.5 15.4h5v26.9h-5V15.4ZM62.5 15.7h5v4.8h-5v-4.8Zm0 7.4h5v19.1h-5v-19ZM81 22.7c5 0 8.4 3.2 9 7.6h-4.8c-.5-1.9-1.9-3.3-4.2-3.3-3.1 0-4.8 2.7-4.8 5.7s1.7 5.8 4.8 5.8c2.3 0 3.7-1.5 4.2-3.4H90c-.6 4.4-3.9 7.6-9 7.6-6 0-9.8-4.6-9.8-10s3.8-10 9.8-10ZM93.5 15.4h5V31l7.2-7.8h5.9l-7 7.7 7.1 11.4h-5.6l-4.8-7.8-2.8 2.9v5h-5V15.4ZM115 36.8h5.5v5.5h-5.4v-5.5Zm.2-10.4v-9.9h5.2v9.9l-1.2 8h-2.8l-1.2-8ZM125.9 36.8h5.4v5.5h-5.4v-5.5Zm0-10.4v-9.9h5.3v9.9l-1.2 8h-2.8l-1.2-8Z" />
          </g>
        </svg>
      </div>

      <style jsx global>{`
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
