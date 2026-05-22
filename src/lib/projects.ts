import type { Project, SpiralLayout } from "@/types/project";

export const projects: Project[] = [
  { title: "Paths of life", slug: "paths-of-life", year: 2024, thumbnailUrl: "/images/projects/paths-of-life.png", dominantBg: "#5e3138", width: 1396, height: 770 },
  { title: "The disease spread on Tiktok", slug: "the-disease-spread-on-tiktok", year: 2024, thumbnailUrl: "/images/projects/the-disease-spread-on-tiktok.png", dominantBg: "#5b2f64", width: 3840, height: 1920 },
  { title: "Ah, Psychedelics", slug: "ah-psychedelics", year: 2025, thumbnailUrl: "/images/projects/ah-psychedelics.png", dominantBg: "#04dcdc", width: 1280, height: 717 },
  { title: "Thought", slug: "thought", year: 2025, thumbnailUrl: "/images/projects/thought.png", dominantBg: "#352623", width: 1146, height: 644 },
  { title: "Jupiter", slug: "jupiter", year: 2026, thumbnailUrl: "/images/projects/jupiter.png", dominantBg: "#2d3e49", width: 1413, height: 760 },
  { title: "Chromatik", slug: "chromatik", year: 2025, thumbnailUrl: "/images/projects/chromatik.png", dominantBg: "#0c04fc", width: 1258, height: 984 },
  { title: "Digital Travel", slug: "digital-travel", year: 2024, thumbnailUrl: "/images/projects/digital-travel.png", dominantBg: "#3350f0", width: 1280, height: 719 },
  { title: "Mercedes AMG", slug: "mercedes-amg", year: 2025, thumbnailUrl: "/images/projects/mercedes-amg.png", dominantBg: "#f4cc58", width: 1920, height: 1080 },
  { title: "The purity revealed", slug: "the-purity-revealed", year: 2025, thumbnailUrl: "/images/projects/the-purity-revealed.png", dominantBg: "#3d3446", width: 3840, height: 2160 },
  { title: "Babylon is burning", slug: "babylon-is-burning", year: 2025, thumbnailUrl: "/images/projects/babylon-is-burning.png", dominantBg: "#272946", width: 1675, height: 928 },
];

// Hand-tuned static positions that mimic the floating spiral of cards from the original
// (the original uses Three.js, so we approximate the visual composition with CSS)
export const spiralLayout: SpiralLayout[] = [
  // x/y in percent of viewport
  { x: 32,  y: 32,  w: 200, rotZ: -8,  rotY: -10, delay: 0,    z: 4 }, // paths-of-life (small front-left)
  { x: 53,  y: 22,  w: 240, rotZ: 4,   rotY: 5,   delay: 0.4,  z: 6 }, // disease tiktok
  { x: 72,  y: 14,  w: 280, rotZ: -3,  rotY: -8,  delay: 0.8,  z: 5 }, // psychedelics
  { x: 49,  y: 48,  w: 320, rotZ: 2,   rotY: 8,   delay: 1.2,  z: 8 }, // thought (center)
  { x: 66,  y: 56,  w: 270, rotZ: -5,  rotY: -6,  delay: 1.6,  z: 7 }, // jupiter
  { x: 78,  y: 70,  w: 220, rotZ: 6,   rotY: 10,  delay: 2.0,  z: 5 }, // chromatik
  { x: 41,  y: 74,  w: 240, rotZ: -7,  rotY: -12, delay: 2.4,  z: 6 }, // digital travel
  { x: 30,  y: 56,  w: 180, rotZ: 5,   rotY: 4,   delay: 2.8,  z: 4 }, // mercedes (smaller back)
  { x: 24,  y: 18,  w: 160, rotZ: 10,  rotY: 18,  delay: 3.2,  z: 3 }, // purity
  { x: 88,  y: 38,  w: 200, rotZ: -10, rotY: -14, delay: 3.6,  z: 4 }, // babylon
];
