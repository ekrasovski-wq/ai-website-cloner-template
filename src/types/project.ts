export interface Project {
  title: string;
  slug: string;
  year: number;
  thumbnailUrl: string;
  dominantBg: string;
  width: number;
  height: number;
}

export interface SpiralLayout {
  /** percent of viewport width (0..100) for translateX positioning */
  x: number;
  /** percent of viewport height (0..100) for translateY positioning */
  y: number;
  /** card display width in px */
  w: number;
  /** rotation in degrees (around Z) */
  rotZ: number;
  /** small perspective rotation around Y in degrees */
  rotY: number;
  /** float animation delay (seconds) */
  delay: number;
  /** z-index */
  z: number;
}
