"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/projects";

interface ListViewProps {
  active: boolean;
}

/**
 * Centered project list. On hover, a thumbnail preview floats with the cursor
 * (smoothly eased), mirroring the behaviour on pacomepertant.com's list view.
 */
export function ListView({ active }: ListViewProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Smooth cursor-following preview
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
    }

    function tick() {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      const el = previewRef.current;
      if (el) {
        el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    }
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [active]);

  const hoveredProject = projects.find((p) => p.slug === hovered);

  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center px-6 py-[110px] transition-opacity duration-700 ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <nav className="flex flex-col items-center gap-[4px] text-center">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            onMouseEnter={() => setHovered(p.slug)}
            onMouseLeave={() => setHovered(null)}
            className="text-[clamp(34px,5vw,58px)] leading-[1.05] font-medium tracking-[-0.018em] text-[#FAFAFA] transition-all duration-300"
            style={{
              opacity: hovered && hovered !== p.slug ? 0.35 : 1,
              transitionDelay: active ? `${i * 35}ms` : "0ms",
              transform: active ? "translateY(0)" : "translateY(8px)",
              transitionProperty: "opacity, transform",
            }}
          >
            {p.title}
          </Link>
        ))}
      </nav>

      {/* Cursor-following hover preview (mounted always, faded when no hover) */}
      <div
        ref={previewRef}
        className="pointer-events-none fixed top-0 left-0 z-20 w-[260px] aspect-video rounded-[12px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-opacity duration-300"
        style={{
          opacity: hoveredProject ? 1 : 0,
          backgroundColor: hoveredProject?.dominantBg ?? "transparent",
          willChange: "transform",
        }}
      >
        {hoveredProject && (
          <Image
            key={hoveredProject.slug}
            src={hoveredProject.thumbnailUrl}
            alt=""
            fill
            sizes="260px"
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}
