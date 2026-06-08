"use client";
// Client-only canvas for the mascot.
//
// The curly hair outline is too complex/self-intersecting for a WebGL
// triangulator (extruding it gives spike/sash artifacts), so the whole mascot
// is composited onto a 2D canvas and shown as a flat TEXTURE on a plane —
// pixel-perfect, zero triangulation. The raw SVG paints the face + stars in
// the hair colour, so on the canvas we repaint them white (then redraw the
// eyes / cheeks / smile on top). A gentle wobble gives it a 3D feel.

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const VB_W = 763.31;
const VB_H = 845.71;
const HAIR = "#edd262";

function fillOf(path: { userData?: { style?: { fill?: string } } }) {
  const f = path.userData?.style?.fill;
  return f && f !== "none" ? f : "#1a1a1a";
}

function tracePath(ctx: CanvasRenderingContext2D, shape: THREE.Shape) {
  const draw = (pts: THREE.Vector2[]) => {
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
  };
  ctx.beginPath();
  draw(shape.getPoints(48));
  for (const h of shape.holes) draw(h.getPoints(48));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function paintTexture(data: any, img: HTMLImageElement): THREE.CanvasTexture {
  const s = 2;
  const cv = document.createElement("canvas");
  cv.width = Math.round(VB_W * s);
  cv.height = Math.round(VB_H * s);
  const ctx = cv.getContext("2d")!;
  ctx.scale(s, s);

  // 1) The raw art (hair + everything) — face + stars are hair-coloured here.
  ctx.drawImage(img, 0, 0, VB_W, VB_H);

  const shapesPerPath: THREE.Shape[][] = data.paths.map((p: unknown) =>
    SVGLoader.createShapes(p as never),
  );
  let headIdx = -1;
  let headCount = 1;
  data.paths.forEach((_p: unknown, i: number) => {
    if (shapesPerPath[i].length > headCount) { headCount = shapesPerPath[i].length; headIdx = i; }
  });

  // 2) Repaint the hair path's smaller sub-shapes (face + stars) white.
  if (headIdx >= 0) {
    const shapes = shapesPerPath[headIdx];
    const bboxArea = (sh: THREE.Shape) => {
      const pts = sh.getPoints(24);
      let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
      for (const p of pts) {
        if (p.x < a) a = p.x; if (p.y < b) b = p.y;
        if (p.x > c) c = p.x; if (p.y > d) d = p.y;
      }
      return (c - a) * (d - b);
    };
    const areas = shapes.map(bboxArea);
    const bodyIdx = areas.indexOf(Math.max(...areas));
    ctx.fillStyle = "#ffffff";
    shapes.forEach((sh, j) => {
      if (j === bodyIdx) return;
      tracePath(ctx, sh);
      ctx.fill("evenodd");
    });
  }

  // 3) Redraw facial features (eyes/lashes/smile + cheeks) on top of the white.
  data.paths.forEach((p: unknown, i: number) => {
    if (i === headIdx) return;
    const hex = fillOf(p as never).toLowerCase();
    if (hex === HAIR) return; // hair accents already painted in step 1
    ctx.fillStyle = hex;
    for (const sh of shapesPerPath[i]) {
      tracePath(ctx, sh);
      ctx.fill("evenodd");
    }
  });

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let svgData: any = null;
    let img: HTMLImageElement | null = null;
    const tryBuild = () => { if (alive && svgData && img) setTex(paintTexture(svgData, img)); };

    new SVGLoader().load("/images/mascot.svg", (d) => { svgData = d; tryBuild(); });

    const im = new Image();
    im.onload = () => { img = im; tryBuild(); };
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
