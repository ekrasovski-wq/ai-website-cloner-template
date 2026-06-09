"use client";
// Mascot logo — the hand-drawn "starry curly hair" face. Previously rendered in
// a per-instance WebGL canvas (with a 2.5M-pixel flood-fill on load + an
// always-on render loop), which janked weak laptops because this logo sits on
// EVERY page. It's now a pre-rendered transparent PNG shown as a plain <img>
// with a CSS float + hover lift — visually the same, but zero WebGL/CPU cost.

import Image from "next/image";
import { play } from "@/lib/sounds";

export function Mascot3D({ size = 96, onClick }: { size?: number; onClick?: () => void }) {
  const handleClick = () => {
    play("smiley/smiley1");
    onClick?.();
  };

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        cursor: "pointer",
        animation: "logoFloat 6s ease-in-out infinite",
        filter: "drop-shadow(0 8px 26px rgba(67, 59, 56, 0.35))",
      }}
      className="mascot-logo select-none"
      onClick={handleClick}
    >
      <Image
        src="/images/mascot-logo.png"
        alt="Elene Krasowski"
        fill
        sizes="110px"
        priority
        draggable={false}
        style={{ objectFit: "contain", transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)" }}
      />
      <style jsx global>{`
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .mascot-logo:hover img { transform: scale(1.08); }
      `}</style>
    </div>
  );
}
