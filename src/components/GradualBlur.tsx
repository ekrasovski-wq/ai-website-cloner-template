"use client";
// Adapted from reactbits "GradualBlur". A stack of progressively-blurred,
// masked layers pinned to one screen edge — used as a soft blur behind the
// fixed header (smiley logo + menu button) on mobile/scrolling pages.

import React, { useMemo } from "react";

const CURVE_FUNCTIONS: Record<string, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
};

interface GradualBlurProps {
  position?: "top" | "bottom" | "left" | "right";
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  curve?: keyof typeof CURVE_FUNCTIONS;
  opacity?: number;
  target?: "parent" | "page";
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}

function GradualBlur({
  position = "top",
  strength = 2,
  height = "6rem",
  width,
  divCount = 5,
  exponential = false,
  curve = "linear",
  opacity = 1,
  target = "page",
  zIndex = 1000,
  className = "",
  style = {},
}: GradualBlurProps) {
  const dir =
    { top: "to top", bottom: "to bottom", left: "to left", right: "to right" }[position] ||
    "to bottom";

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / divCount;
    const curveFunc = CURVE_FUNCTIONS[curve] || CURVE_FUNCTIONS.linear;
    for (let i = 1; i <= divCount; i++) {
      const progress = curveFunc(i / divCount);
      const blurValue = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * divCount + 1) * strength;
      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;
      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;
      divs.push(
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            maskImage: `linear-gradient(${dir}, ${gradient})`,
            WebkitMaskImage: `linear-gradient(${dir}, ${gradient})`,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity,
          }}
        />,
      );
    }
    return divs;
  }, [divCount, curve, exponential, strength, dir, opacity]);

  const isVertical = position === "top" || position === "bottom";
  const isPage = target === "page";
  const containerStyle: React.CSSProperties = {
    position: isPage ? "fixed" : "absolute",
    pointerEvents: "none",
    zIndex: isPage ? zIndex + 100 : zIndex,
    ...(isVertical
      ? { height, width: width || "100%", left: 0, right: 0, [position]: 0 }
      : { width: width || height, height: "100%", top: 0, bottom: 0, [position]: 0 }),
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>{blurDivs}</div>
    </div>
  );
}

export default React.memo(GradualBlur);
