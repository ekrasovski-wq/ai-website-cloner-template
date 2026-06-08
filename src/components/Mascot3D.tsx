"use client";
// 3D mascot — the hand-drawn "starry curly hair" face SVG, extruded into a
// real 3D object. The WebGL canvas lives in MascotCanvas and is loaded
// client-only; this wrapper handles sizing, the float animation, hover and the
// smiley click sound.

import { useState } from "react";
import dynamic from "next/dynamic";
import { play } from "@/lib/sounds";

const MascotCanvas = dynamic(() => import("./MascotCanvas"), { ssr: false });

export function Mascot3D({ size = 96, onClick }: { size?: number; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

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
      className="select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <MascotCanvas hovered={hovered} />
      <style jsx global>{`
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
