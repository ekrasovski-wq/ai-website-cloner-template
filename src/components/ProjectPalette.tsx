"use client";

// "Brand System" block for the project detail page — a premium, visual summary
// of the project's colours and typefaces. Colours are auto-extracted from the
// cover image (so they reflect the real work); typeface names are passed in
// (read from the source PDF's embedded fonts). Purely presentational and
// theme-aware; nothing here affects the rest of the site.

import { useEffect, useState } from "react";

const SANS = 'Indivisible, "Helvetica Neue", Arial, sans-serif';

type Bucket = { r: number; g: number; b: number; n: number };

function accumulate(img: HTMLImageElement, buckets: Map<string, Bucket>) {
  const S = 72;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const ctx = c.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(img, 0, 0, S, S);
  let data: Uint8ClampedArray;
  try { data = ctx.getImageData(0, 0, S, S).data; } catch { return; }
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
    const e = buckets.get(key);
    if (e) { e.r += r; e.g += g; e.b += b; e.n++; } else buckets.set(key, { r, g, b, n: 1 });
  }
}

// Pick the palette from accumulated buckets. Frequency drives the ranking, but
// saturated colours get a boost so a brand accent (e.g. a small orange mark)
// surfaces even when the cover is mostly a photo.
function pickPalette(buckets: Map<string, Bucket>, max = 6): string[] {
  const cols = [...buckets.values()].map((e) => {
    const r = e.r / e.n, g = e.g / e.n, b = e.b / e.n;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const sat = mx <= 0 ? 0 : (mx - mn) / mx;
    return { r, g, b, score: e.n * (1 + sat * 2.2) };
  }).sort((a, b) => b.score - a.score);
  const dist = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) =>
    Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
  const chosen: { r: number; g: number; b: number }[] = [];
  for (const col of cols) {
    if (chosen.every((ch) => dist(ch, col) > 40)) {
      chosen.push(col);
      if (chosen.length >= max) break;
    }
  }
  const h = (v: number) => Math.round(v).toString(16).padStart(2, "0");
  return chosen.map((c) => `#${h(c.r)}${h(c.g)}${h(c.b)}`);
}

// Readable ink colour for text sitting on a given hex background.
function inkOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.92)";
}

export function ProjectPalette({
  images,
  fonts = [],
  style,
}: {
  images: string[];
  fonts?: string[];
  style?: React.CSSProperties;
}) {
  const [palette, setPalette] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    // Sample across up to 6 slides so the palette reflects the whole project
    // (accents included), not just the cover.
    const srcs = images.slice(0, 6);
    const buckets = new Map<string, Bucket>();
    let done = 0;
    srcs.forEach((src) => {
      const im = new Image();
      const finish = () => {
        done++;
        if (done === srcs.length && alive) setPalette(pickPalette(buckets));
      };
      im.onload = () => { accumulate(im, buckets); finish(); };
      im.onerror = finish;
      im.src = src;
    });
    return () => { alive = false; };
  }, [images]);

  const named = fonts.filter(Boolean);

  return (
    <section style={style} className="my-16 sm:my-24">
      <div className="flex items-baseline gap-4 mb-10">
        <span className="text-[12px] tracking-[0.3em] uppercase text-white/35" style={{ fontFamily: SANS }}>
          Brand system
        </span>
        <span className="flex-1 h-px bg-white/10" />
      </div>

      {/* ===== Colour ===== */}
      <div className="mb-16">
        <h3 className="text-[13px] tracking-[0.18em] uppercase text-white/45 mb-5" style={{ fontFamily: SANS }}>
          Colour palette
        </h3>
        <div className="flex h-36 sm:h-52 w-full rounded-[20px] overflow-hidden border border-white/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]">
          {(palette.length ? palette : Array(5).fill(null)).map((hex, i) => (
            <div
              key={i}
              className="relative flex-1 min-w-0 flex items-end transition-[flex-grow] duration-500 hover:flex-[1.6]"
              style={{ background: hex ?? "rgba(128,128,128,0.15)" }}
            >
              {hex && (
                <span
                  className="m-3 sm:m-4 text-[11px] sm:text-[13px] tracking-wide tabular-nums font-medium"
                  style={{ fontFamily: SANS, color: inkOn(hex) }}
                >
                  {hex.toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===== Typography ===== */}
      <div>
        <h3 className="text-[13px] tracking-[0.18em] uppercase text-white/45 mb-5" style={{ fontFamily: SANS }}>
          Typefaces
        </h3>
        <div className="flex flex-col gap-4">
          {(named.length ? named : ["Custom lettering"]).map((font, i) => (
            <div
              key={font + i}
              className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-7 sm:px-9 sm:py-9 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10"
            >
              <span
                className="leading-none text-white shrink-0"
                style={{ fontFamily: SANS, fontSize: "clamp(64px,11vw,120px)", fontWeight: 600, letterSpacing: "-0.02em" }}
              >
                Aa
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[clamp(26px,4vw,40px)] font-medium tracking-tight text-white leading-tight" style={{ fontFamily: SANS }}>
                  {font}
                </p>
                <p className="mt-1 text-[12px] tracking-[0.18em] uppercase" style={{ fontFamily: SANS, color: "#edd262" }}>
                  {named.length > 1 ? (i === 0 ? "Primary" : "Secondary") : "Primary"} typeface
                </p>
                <p className="mt-5 text-white/40 text-[14px] sm:text-[16px] tracking-wide break-words" style={{ fontFamily: SANS }}>
                  ABCDEFGHIJKLM&nbsp;&nbsp;nopqrstuvwxyz&nbsp;&nbsp;0123456789
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
