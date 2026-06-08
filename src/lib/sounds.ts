"use client";
import { Howl } from "howler";

export type SoundName =
  | "ambient" | "hover" | "click" | "longclick"
  | "switch" | "spiral" | "list" | "tick" | "close" | "whoosh"
  | "menu/homelink" | "menu/aboutlink"
  | "smiley/smiley1" | "smiley/smiley2" | "smiley/smiley3" | "smiley/smiley4";

const FILES: Record<SoundName, { volume?: number; loop?: boolean; ext?: string }> = {
  ambient: { volume: 0.4, loop: true },
  hover: { volume: 0.6 },
  click: { volume: 0.8 },
  longclick: { volume: 0.7 },
  switch: { volume: 0.7 },
  spiral: { volume: 0.7 },
  list: { volume: 0.7 },
  tick: { volume: 0.5 },
  close: { volume: 0.7 },
  whoosh: { volume: 1.0, ext: "mp3" },
  "menu/homelink": { volume: 0.7 },
  "menu/aboutlink": { volume: 0.7 },
  "smiley/smiley1": { volume: 0.4 },
  "smiley/smiley2": { volume: 0.4 },
  "smiley/smiley3": { volume: 0.4 },
  "smiley/smiley4": { volume: 0.4 },
};

let cache: Partial<Record<SoundName, Howl>> = {};
let muted = false;

export function setMuted(v: boolean) {
  muted = v;
  Object.values(cache).forEach((h) => h?.mute(v));
}

export function isMuted() { return muted; }

function load(name: SoundName) {
  if (cache[name]) return cache[name]!;
  const opts = FILES[name];
  const ext = opts.ext ?? "ogg";
  const h = new Howl({
    src: [`/sounds/${name}.${ext}`],
    volume: opts.volume ?? 0.7,
    loop: !!opts.loop,
    preload: true,
  });
  if (muted) h.mute(true);
  cache[name] = h;
  return h;
}

export function play(name: SoundName) {
  if (typeof window === "undefined") return;
  try { load(name).play(); } catch {}
}

export function playRandomSmiley() {
  const i = (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4;
  play(`smiley/smiley${i}` as SoundName);
}

export function startAmbient() { play("ambient"); }
export function stopAmbient() { cache.ambient?.stop(); }
