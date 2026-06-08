"use client";
// Client-only canvas for the mascot.
//
// To match the SVG EXACTLY with zero artifacts, we rasterise the SVG the same
// way the browser draws it (pixel-perfect — no WebGL triangulation, no
// heuristics), then flood-fill the interior "holes" (the face + stars, which
// the SVG leaves transparent) to white so the face reads on the dark site
// background. The result is shown as a flat texture with a gentle wobble.

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VB_W = 763.31;
const VB_H = 845.71;

function buildTexture(img: HTMLImageElement): THREE.CanvasTexture {
  const s = 2;
  const W = Math.round(VB_W * s);
  const H = Math.round(VB_H * s);
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d")!;
  ctx.drawImage(img, 0, 0, W, H);

  const id = ctx.getImageData(0, 0, W, H);
  const a = id.data;
  const N = W * H;
  const AT = 20; // alpha threshold: above this counts as a drawn (boundary) pixel

  // Flood-fill the transparent EXTERIOR starting from the canvas borders. Any
  // transparent pixel NOT reached is an interior hole (face / stars).
  const outside = new Uint8Array(N);
  const stack = new Int32Array(N);
  let sp = 0;
  const seed = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = y * W + x;
    if (outside[i] || a[i * 4 + 3] > AT) return;
    outside[i] = 1;
    stack[sp++] = i;
  };
  for (let x = 0; x < W; x++) { seed(x, 0); seed(x, H - 1); }
  for (let y = 0; y < H; y++) { seed(0, y); seed(W - 1, y); }
  while (sp > 0) {
    const i = stack[--sp];
    const x = i % W;
    const y = (i / W) | 0;
    seed(x - 1, y); seed(x + 1, y); seed(x, y - 1); seed(x, y + 1);
  }

  // Interior transparent pixels → solid white (the face + the stars).
  for (let i = 0; i < N; i++) {
    if (a[i * 4 + 3] <= AT && !outside[i]) {
      a[i * 4] = 255;
      a[i * 4 + 1] = 255;
      a[i * 4 + 2] = 255;
      a[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(id, 0, 0);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function MascotModel({ hovered }: { hovered: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  const spin = useRef(0);

  useEffect(() => {
    let alive = true;
    const im = new Image();
    im.onload = () => { if (alive) setTex(buildTexture(im)); };
    im.src = "/images/mascot.svg";
    return () => { alive = false; };
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const amp = hovered ? 0.4 : 0.2;
    spin.current += (amp - spin.current) * Math.min(1, dt * 3);
    const t = performance.now() / 1000;
    ref.current.rotation.y = Math.sin(t * 0.8) * spin.current;
    ref.current.rotation.x = Math.sin(t * 0.6) * 0.05;
  });

  if (!tex) return null;
  const scale = 4 / Math.max(VB_W, VB_H);
  return (
    <group ref={ref} scale={scale}>
      <mesh>
        <planeGeometry args={[VB_W, VB_H]} />
        <meshBasicMaterial map={tex} transparent alphaTest={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function MascotCanvas({ hovered }: { hovered: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <MascotModel hovered={hovered} />
    </Canvas>
  );
}
