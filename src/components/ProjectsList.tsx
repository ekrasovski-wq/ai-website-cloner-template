"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { PROJECTS } from "@/lib/projects";
import { play } from "@/lib/sounds";

export function ProjectsList({ visible = true }: { visible?: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const router = useRouter();
  // Lines cascade top→bottom with this gap between starts.
  const STAGGER_MS = 55;
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-10 overflow-y-auto overscroll-contain"
      style={{
        pointerEvents: visible ? "auto" : "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* min-h-full + justify-center: centred when it fits, but scrolls from
          the top (clear of the spiral/list toggle) when the list is tall.
          data-lenis-prevent lets this container scroll past Lenis. */}
      <div className="min-h-full flex flex-col items-center justify-center px-4 pt-32 pb-24">
      <ul className="flex flex-col items-center gap-0.5 sm:gap-1">
        {PROJECTS.map((p, i) => (
          <li key={p.id}>
            {/* Outer motion element handles ONLY the entrance (blur + y +
                opacity). Hover dimming lives on the inner span so the two
                opacity sources never fight — that conflict was leaving the
                buttons stuck semi-transparent / unclickable after repeated
                spiral↔list switches. */}
            <motion.button
              initial={{ filter: "blur(12px)", opacity: 0, y: 40 }}
              animate={
                visible && mounted
                  ? { filter: "blur(0px)", opacity: 1, y: 0 }
                  : { filter: "blur(12px)", opacity: 0, y: 40 }
              }
              transition={{
                duration: 0.45,
                delay: visible ? (i * STAGGER_MS) / 1000 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseEnter={() => { setActive(i); play("hover"); }}
              onMouseLeave={() => setActive(null)}
              onClick={() => { play("longclick"); router.push(`/projects/${p.slug}`); }}
              className="block text-center"
              style={{ fontSize: "clamp(26px, 7vw, 60px)", lineHeight: 1.15, fontWeight: 400 }}
            >
              <span
                style={{
                  color: "#ffffff",
                  opacity: active === null ? 1 : active === i ? 1 : 0.35,
                  transition: "opacity 0.2s ease",
                }}
              >
                {p.title}
              </span>
            </motion.button>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
