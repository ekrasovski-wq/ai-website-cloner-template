"use client";

// Test block for the project detail page: shows the project's colour palette
// (auto-extracted from its cover image, so it reflects the real work) plus a
// typographic specimen. Purely visual — nothing here affects the rest of the
// site. Colours are read client-side from a downscaled canvas.

import { useEffect, useState } from "react";

const SANS = 'Indivisible, "Helvetica Neue", Arial, sans-serif';

function extractPalette(img: HTMLImageElement, max = 6): string[] {
  const S = 64;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d");
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, S, S);
  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, S, S).data;
  } catch {
    return [];
  }
  // Bucket colours coarsely, then average each bucket.
  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
    const e = buckets.get(key);
    if (e) { e.r += r; e.g += g; e.b += b; e.n++; }
    else buckets.set(key, { r, g, b, n: 1 });
  }
  const sorted = [...buckets.values()]
    .map((e) => ({ r: e.r / e.n, g: e.g / e.n, b: e.b / e.n, n: e.n }))
    .sort((a, b) => b.n - a.n);
  const dist = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) =>
    Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
  const chosen: { r: number; g: number; b: number }[] = [];
  for (const col of sorted) {
    if (chosen.every((ch) => dist(ch, col) > 38)) {
      chosen.push(col);
      if (chosen.length >= max) break;
    }
  }
  const h = (v: number) => Math.round(v).toString(16).padStart(2, "0");
  return chosen.map((c) => `#${h(c.r)}${h(c.g)}${h(c.b)}`);
}

export function ProjectPalette({ image, style }: { image: string; style?: React.CSSProperties }) {
  const [palette, setPalette] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    const im = new Image();
    im.onload = () => { if (alive) setPalette(extractPalette(im)); };
    im.src = image;
    return () => { alive = false; };
  }, [image]);

  return (
    <section style={style} className="my-14">
      <p className="text-[12px] tracking-[0.25em] uppercase text-white/40 mb-8" style={{ fontFamily: SANS }}>
        Colours &amp; Type
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Colours */}
        <div>
          <h3 className="text-[15px] text-white/60 mb-4" style={{ fontFamily: SANS }}>Colour palette</h3>
          <div className="flex flex-wrap gap-3">
            {(palette.length ? palette : Array(5).fill(null)).map((hex, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span
                  className="w-16 h-16 sm:w-[76px] sm:h-[76px] rounded-xl border border-white/10"
                  style={{ background: hex ?? "rgba(255,255,255,0.05)" }}
                />
                <span className="text-[11px] tracking-wide text-white/45 tabular-nums" style={{ fontFamily: SANS }}>
                  {hex ? hex.toUpperCase() : "·····"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div>
          <h3 className="text-[15px] text-white/60 mb-4" style={{ fontFamily: SANS }}>Typography</h3>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-end gap-5">
              <span className="leading-none tracking-tight" style={{ fontFamily: SANS, fontSize: "clamp(56px,10vw,96px)", fontWeight: 600 }}>Aa</span>
              <div className="pb-2">
                <p className="text-white/80 text-[18px]" style={{ fontFamily: SANS, fontWeight: 500 }}>Display</p>
                <p className="text-white/45 text-[13px]" style={{ fontFamily: SANS }}>Regular · Medium · Bold</p>
              </div>
            </div>
            <p className="mt-5 text-white/55 text-[15px] leading-relaxed break-words" style={{ fontFamily: SANS }}>
              ABCDEFGHIJKLM nopqrstuvwxyz 0123456789
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
