"use client";
// Floating row of tool/platform badges shown under the About text. Each badge
// gently bobs in the air (staggered) and lifts on hover. Adobe apps use their
// official lettermark style; Figma and Claude use their real marks.

import { play } from "@/lib/sounds";

type Tool =
  | { name: string; kind: "text"; label: string; bg: string; fg: string }
  | { name: string; kind: "figma" | "claude" };

const TOOLS: Tool[] = [
  { name: "Adobe Illustrator", kind: "text", label: "Ai", bg: "#330000", fg: "#ff9a00" },
  { name: "Adobe Photoshop", kind: "text", label: "Ps", bg: "#001e36", fg: "#31a8ff" },
  { name: "Adobe After Effects", kind: "text", label: "Ae", bg: "#00005b", fg: "#c9bfff" },
  { name: "Adobe Premiere Pro", kind: "text", label: "Pr", bg: "#2a0040", fg: "#ea77ff" },
  { name: "Figma", kind: "figma" },
  { name: "Claude", kind: "claude" },
  { name: "Higgsfield", kind: "text", label: "Hf", bg: "#141414", fg: "#ffffff" },
  { name: "Blender", kind: "text", label: "Bl", bg: "#141414", fg: "#ea7600" },
  { name: "Archicad", kind: "text", label: "Ac", bg: "#06283c", fg: "#1ba1e2" },
  { name: "3ds Max", kind: "text", label: "3ds", bg: "#08252b", fg: "#37a5cc" },
];

function FigmaMark() {
  return (
    <svg viewBox="0 0 38 57" width="26" height="26" aria-hidden>
      <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
      <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
      <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
    </svg>
  );
}

function ClaudeMark() {
  // Coral sunburst, à la the Anthropic / Claude mark.
  const rays = Array.from({ length: 12 });
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <g fill="#d97757">
        {rays.map((_, i) => (
          <rect
            key={i}
            x="11"
            y="1.5"
            width="2"
            height="9"
            rx="1"
            transform={`rotate(${(360 / rays.length) * i} 12 12)`}
          />
        ))}
      </g>
    </svg>
  );
}

export function ToolsCloud() {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {TOOLS.map((t, i) => (
        <div
          key={t.name}
          title={t.name}
          onMouseEnter={() => play("hover")}
          className="tool-badge group relative flex items-center justify-center rounded-[15px] border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.45)] cursor-default"
          style={{
            width: 56,
            height: 56,
            background: t.kind === "text" ? t.bg : "#141414",
            animation: `toolBob ${3 + (i % 4) * 0.4}s ease-in-out ${i * 0.18}s infinite`,
          }}
        >
          {t.kind === "text" ? (
            <span style={{ color: t.fg, fontWeight: 800, fontSize: t.label.length > 2 ? 16 : 20, letterSpacing: "-0.02em" }}>
              {t.label}
            </span>
          ) : t.kind === "figma" ? (
            <FigmaMark />
          ) : (
            <ClaudeMark />
          )}
          {/* name tooltip on hover */}
          <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-white/90 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {t.name}
          </span>
        </div>
      ))}

      <style jsx global>{`
        @keyframes toolBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(-2deg); }
        }
        .tool-badge { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }
        .tool-badge:hover { animation-play-state: paused; transform: translateY(-9px) scale(1.14); }
      `}</style>
    </div>
  );
}
