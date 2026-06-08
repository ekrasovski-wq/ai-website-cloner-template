"use client";
// Verbatim transcription of pacomepertant.com's SolidButton hover animation.
// Each letter wiggles on hover: random rotation ±15°, random scale 1.15-1.4,
// font-weight 600, then bounces back with elastic easing.

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface WiggleTextProps {
  label: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function WiggleText({ label, className = "", style }: WiggleTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    if (!letters.length) return;

    // Pacome's exact timeline.
    const tl = gsap.timeline({ paused: true });
    tl.to(letters, {
      rotation: () => gsap.utils.random(-15, 15),
      scale: () => gsap.utils.random(1.15, 1.4),
      fontWeight: 600,
      duration: 0.25,
      ease: "power2.out",
      stagger: { amount: 0.25 },
    }).to(letters, {
      rotation: 0,
      scale: 1,
      fontWeight: 500,
      duration: 0.25,
      ease: "elastic.out(1, 0.8)",
      stagger: { amount: 0.25 },
    });

    const onEnter = () => tl.restart();
    const node = containerRef.current;
    node.addEventListener("mouseenter", onEnter);
    return () => {
      node.removeEventListener("mouseenter", onEnter);
      tl.kill();
    };
  }, [label]);

  return (
    <span ref={containerRef} className={className} style={style}>
      {label.split("").map((ch, i) => (
        <span
          key={i}
          ref={(el) => { lettersRef.current[i] = el; }}
          style={{ display: "inline-block", willChange: "transform" }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
