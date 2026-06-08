"use client";

// Pacome-spec spiral carousel — reverse-engineered from pacomepertant.com.
// Original class: ProjectPlane in 0011_rgzkqdZW.js. Their formula:
//
//   N = (index - scrollOffset) mod projectsCount
//   B = N - centerIndex
//   V = B * angleGap           // 0.85 rad
//   y = B * verticalGap - 0.8  // verticalGap = 0.5
//   r = baseRadius             // 2
//   position = (cos(V)*r, y, sin(V)*r)
//   rotation.y = -V + PI/2     // cards face along spiral tangent, NOT billboarded
//
//   Cards: 9 projects × 2 copies = 18 planes (PlaneGeometry(1, 1, 8, 8)).
//   scaleX = 1.7, scaleY = 1. Wheel input → scrollOffset (damped).
//   No autoplay — purely user-driven.

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useLoader, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { PROJECTS } from "@/lib/projects";
import { play } from "@/lib/sounds";

// Pacome's exact constants
const BASE_SCALE_X = 1.7;
const BASE_SCALE_Y = 1.0;
const VERTICAL_GAP = 0.42;
const ANGLE_GAP = 0.85;
const BASE_RADIUS = 2.0;
const Y_OFFSET = -0.7;

interface PlaneProps {
  url: string;
  index: number;
  projectsCount: number;
  centerIndex: number;
  scrollOffsetRef: React.MutableRefObject<number>;
  wheelDeltaRef: React.MutableRefObject<number>;
  bendRef: React.MutableRefObject<number>;
  projectIndex: number;
  visible: boolean;
  isMobile: boolean;
  onHover: (i: number | null) => void;
  onSelect: (i: number) => void;
}

function ProjectPlane({
  url,
  index,
  projectsCount,
  centerIndex,
  scrollOffsetRef,
  wheelDeltaRef,
  bendRef,
  projectIndex,
  visible,
  isMobile,
  onHover,
  onSelect,
}: PlaneProps) {
  const texture = useLoader(THREE.TextureLoader, url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const meshRef = useRef<THREE.Mesh>(null);
  const hoveredRef = useRef(false);
  const hoverProgress = useRef(0);
  // Pacome's exact reveal/hide model (line 4140):
  //   constructor sets isHidden=true, hiddenProgress=1, hiddenTarget=1.
  //   reveal() flips isHidden=false, hiddenTarget=0.
  //   hide()   flips isHidden=true,  hiddenTarget=1.
  //   g = isHidden ? 1.5 : -1.5  (sign of Y offset).
  //   Y = B*verticalGap - 0.8 - hiddenProgress*g
  //     reveal (g=-1.5, hp 1→0): Y = base + 1.5 → base  (fall from above)
  //     hide   (g=+1.5, hp 0→1): Y = base → base - 1.5  (sink below)
  //   Radius = baseRadius * (1 - hp/2)   (collapse to spine when hidden)
  //   Wave: reveal = (i%4)*50ms, hide = (i%4)*30ms
  const hiddenProgress = useRef(1);
  const hiddenTarget = useRef(1);
  const isHiddenRef = useRef(true);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    if (!visible) {
      isHiddenRef.current = true;
      const wave = (index % 4) * 30;
      const t = setTimeout(() => { hiddenTarget.current = 1; }, wave);
      return () => clearTimeout(t);
    }
    isHiddenRef.current = false;
    const wave = (index % 4) * 50;
    const t = setTimeout(() => { hiddenTarget.current = 0; }, wave);
    return () => clearTimeout(t);
  }, [index, visible]);

  useFrame((_, dt) => {
    if (!meshRef.current) return;
    // Pacome damp: D = 1 - 0.95^(deltaMs*0.15). For 60fps that's ~12% per
    // frame → ~85% reached in ~300ms. Equivalent Three.js damp rate ≈ 7.
    hiddenProgress.current = THREE.MathUtils.damp(
      hiddenProgress.current, hiddenTarget.current, 7, dt,
    );
    const hp = hiddenProgress.current;
    const g = isHiddenRef.current ? 1.5 : -1.5;

    // Pacome formula verbatim.
    let N = index - scrollOffsetRef.current;
    N = ((N % projectsCount) + projectsCount) % projectsCount;
    const B = N - centerIndex;
    const U = B * VERTICAL_GAP + Y_OFFSET - hp * g;
    const G = BASE_RADIUS * (1 - hp / 2);
    const V = B * ANGLE_GAP;
    meshRef.current.position.set(Math.cos(V) * G, U, Math.sin(V) * G);
    meshRef.current.rotation.y = -V + Math.PI / 2;
    // hover lerp
    const target = hoveredRef.current ? 1 : 0;
    hoverProgress.current = THREE.MathUtils.damp(hoverProgress.current, target, 6, dt);
    const hov = hoverProgress.current;

    // Frame-crop effect — applies BOTH during reveal AND on hover.
    //   On reveal: hp 1→0 → frame grows from 0.55 to 1.0 (small → big)
    //   On hover : hov 0→1 → frame shrinks by 12%
    // Image inside is zoomed by the inverse so the picture stays the same
    // on-screen size — only the white border crops/expands.
    const REVEAL_SHRINK = 0.80;             // frame scale 0.20 when hp=1
    const HOVER_SHRINK = 0.12;              // 12% smaller frame on hover
    const frameScale = (1 - REVEAL_SHRINK * hp) * (1 - HOVER_SHRINK * hov);
    meshRef.current.scale.set(
      BASE_SCALE_X * frameScale,
      BASE_SCALE_Y * frameScale,
      1,
    );

    if (matRef.current) {
      matRef.current.uniforms.uColorStrength.value = 0.55 * hov;
      // Inverse frame shrink keeps the image visually full-size, then a
      // tiny extra zoom on hover for "pop".
      matRef.current.uniforms.uZoom.value = (1 / frameScale) * (1 + 0.03 * hov);
      matRef.current.uniforms.uScrollSpeed.value = bendRef.current;
      // Pacome's compound alpha: (1 - hov*0.05) * (1 - hp)
      matRef.current.uniforms.uRevealProgress.value = (1 - hov * 0.05) * (1 - hp);
    }
  });

  // Shader: rounded-rect mask + image, with subtle scroll-driven color shift.
  const shader = useMemo(() => ({
    uniforms: {
      uTexture: { value: texture },
      uColorStrength: { value: 0 },
      uZoom: { value: 1 },
      uPlaneSizes: { value: new THREE.Vector2(BASE_SCALE_X, BASE_SCALE_Y) },
      uImageSizes: { value: new THREE.Vector2(texture.image?.width || 1, texture.image?.height || 1) },
      uScrollSpeed: { value: 0 },
      uRadius: { value: 0.06 },
      uRevealProgress: { value: 1 },  // 1 = fully revealed (default = visible)
    },
    vertexShader: `
      // Verbatim transcription of pacomepertant.com's ProjectPlane shader,
      // extracted from their bundled JS at line 4115-4138.
      #define PI 3.14159265359
      varying vec2 vUv;
      varying float vDepth;   // signed depth in view space (positive = behind camera)
      uniform float uScrollSpeed;

      void main() {
        vUv = uv;
        vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vec3 newPosition = position;
        newPosition.z = sin(uv.x * PI) * 0.2;

        vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        viewPosition.x += pow(worldPosition.y, 2.0) * 0.1;
        viewPosition.x += sin(uv.y * PI) * uScrollSpeed * 2.0;
        // Three.js view space has the camera looking down -Z.
        // -viewPosition.z gives distance in front of the camera.
        vDepth = -viewPosition.z;
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform sampler2D uTexture;
      uniform vec2 uPlaneSizes;
      uniform vec2 uImageSizes;
      uniform float uColorStrength;
      uniform float uZoom;
      uniform float uScrollSpeed;
      uniform float uRadius;
      uniform float uRevealProgress;
      varying vec2 vUv;
      varying float vDepth;

      float roundedRectSDF(vec2 uv, vec2 size, float radius) {
        vec2 d = abs(uv - 0.5) - size * 0.5 + vec2(radius);
        return length(max(d, 0.0)) - radius;
      }

      // Cheap depth-of-field: 9-tap blur with radius proportional to how far
      // behind the focus distance the fragment is. Front cards stay crisp,
      // back cards get progressively softer.
      vec4 sampleBlurred(vec2 uv, float blurStrength) {
        if (blurStrength < 0.0005) return texture2D(uTexture, uv);
        float r = blurStrength;
        vec4 acc = vec4(0.0);
        // 3x3 box around the sample
        for (int x = -1; x <= 1; x++) {
          for (int y = -1; y <= 1; y++) {
            vec2 off = vec2(float(x), float(y)) * r;
            acc += texture2D(uTexture, uv + off);
          }
        }
        return acc / 9.0;
      }

      void main() {
        // cover-fit the image into the plane
        float planeAspect = uPlaneSizes.x / uPlaneSizes.y;
        float imgAspect = uImageSizes.x / uImageSizes.y;
        vec2 scale = vec2(1.0);
        if (imgAspect > planeAspect) {
          scale.x = planeAspect / imgAspect;
        } else {
          scale.y = imgAspect / planeAspect;
        }
        vec2 uv = (vUv - 0.5) / uZoom + 0.5;
        vec2 sampled = (uv - 0.5) * scale + 0.5;

        // DOF: focus depth ~ camera Z minus baseRadius. Cards at the
        // focus plane render crisp; depth beyond that adds blur.
        // Empirically camera z = 6.2, front cards at z ≈ 4.2, back ≈ 8.2.
        float focusZ = 5.0;
        float farZ = 8.5;
        float falloff = clamp((vDepth - focusZ) / (farZ - focusZ), 0.0, 1.0);
        float blur = falloff * 0.018;
        vec4 col = sampleBlurred(sampled, blur);

        // Static rounded-rect mask, full-size always.
        float sdf = roundedRectSDF(vUv, vec2(1.0), uRadius);
        float mask = 1.0 - smoothstep(0.0, 0.005, sdf);
        col.a *= mask;
        // Pacome's reveal: just multiply alpha by uRevealProgress.
        col.a *= uRevealProgress;

        // hover desaturate/brighten mix
        float lum = dot(col.rgb, vec3(0.299, 0.587, 0.114));
        col.rgb = mix(col.rgb, mix(vec3(lum), vec3(1.0), 0.15), uColorStrength);
        gl_FragColor = col;
      }
    `,
  }), [texture]);

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        hoveredRef.current = true;
        onHover(projectIndex);
        document.body.style.cursor = "pointer";
        play("hover");
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        play("longclick");
        onSelect(projectIndex);
      }}
      onPointerOut={() => {
        hoveredRef.current = false;
        onHover(null);
        document.body.style.cursor = "";
      }}
    >
      <planeGeometry args={[1, 1, 8, 8]} />
      <shaderMaterial
        ref={matRef}
        attach="material"
        args={[shader]}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface WorldProps {
  scrollOffsetRef: React.MutableRefObject<number>;
  wheelDeltaRef: React.MutableRefObject<number>;
  bendRef: React.MutableRefObject<number>;
  visible: boolean;
  isMobile: boolean;
  onHover: (i: number | null) => void;
  onSelect: (i: number) => void;
}

function World({ scrollOffsetRef, wheelDeltaRef, bendRef, visible, isMobile, onHover, onSelect }: WorldProps) {
  // Pacome doubles the project list. We do the same.
  const planes = useMemo(() => {
    const doubled = [...PROJECTS, ...PROJECTS];
    return doubled.map((p, i) => ({ project: p, index: i }));
  }, []);
  const projectsCount = planes.length;
  const centerIndex = Math.floor(projectsCount / 2);

  return (
    <>
      {planes.map((p, i) => (
        <ProjectPlane
          key={i}
          url={p.project.sticker}
          index={p.index}
          projectsCount={projectsCount}
          centerIndex={centerIndex}
          scrollOffsetRef={scrollOffsetRef}
          wheelDeltaRef={wheelDeltaRef}
          bendRef={bendRef}
          projectIndex={i % PROJECTS.length}
          visible={visible}
          isMobile={isMobile}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export function ProjectsCarousel3D({
  onActiveChange,
  visible = true,
}: { onActiveChange?: (i: number | null) => void; visible?: boolean }) {
  // scrollOffset: integer-ish phase value. Wheel drives the target; current
  // lerps toward target (gives the springy feel from Pacome).
  const scrollOffsetRef = useRef(0);
  const scrollTargetRef = useRef(0);
  const wheelDeltaRef = useRef(0);
  // Signed bend (rad) for each card. Idle = ~0 (flat). Scrolling adds
  // signed bend proportional to velocity, direction flips per scroll direction.
  const bendRef = useRef(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const lastTickedRef = useRef(-1);

  // Mobile detection → smaller spiral, camera pulled back, touch controls.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Keep a live ref of `visible` so window-level listeners (which only bind
  // once) can read the current value instead of a stale closure.
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  // Touch swipe → spin the spiral (mobile). Vertical drag maps to scrollTarget.
  useEffect(() => {
    let startY = 0;
    let lastY = 0;
    let active = false;
    const onStart = (e: TouchEvent) => {
      if (!visibleRef.current) return;
      active = true;
      startY = lastY = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      if (!active || !visibleRef.current) return;
      const y = e.touches[0].clientY;
      const dy = lastY - y;       // drag up → positive → spin forward
      lastY = y;
      scrollTargetRef.current += dy * 0.006;
      wheelDeltaRef.current = dy * 4;
    };
    const onEnd = () => { active = false; void startY; };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  // Wheel → target offset
  useEffect(() => {
    let decayRaf = 0;
    let lastWhoosh = 0;
    const onWheel = (e: WheelEvent) => {
      if (!visibleRef.current) return;  // ignore scroll while in list view
      // Sensitivity: one wheel notch (deltaY ~100) → ~0.11 offset.
      scrollTargetRef.current += e.deltaY * 0.0011;
      wheelDeltaRef.current = e.deltaY;
      // Play whoosh on bigger scroll bursts, throttled to once per 250ms.
      const now = performance.now();
      if (Math.abs(e.deltaY) > 80 && now - lastWhoosh > 250) {
        lastWhoosh = now;
        play("whoosh");
      }
      // decay wheelDelta to 0
      if (decayRaf) cancelAnimationFrame(decayRaf);
      const decay = () => {
        wheelDeltaRef.current *= 0.92;
        if (Math.abs(wheelDeltaRef.current) > 0.5) decayRaf = requestAnimationFrame(decay);
        else wheelDeltaRef.current = 0;
      };
      decayRaf = requestAnimationFrame(decay);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (decayRaf) cancelAnimationFrame(decayRaf);
    };
  }, []);

  // Per-frame: continuous slow auto-spin + lerp toward scroll target
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const AUTO_SPEED = 0.18; // offset units per second
    const loop = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      scrollTargetRef.current += AUTO_SPEED * dt;
      const prev = scrollOffsetRef.current;
      scrollOffsetRef.current = THREE.MathUtils.damp(
        scrollOffsetRef.current,
        scrollTargetRef.current,
        4,
        dt,
      );
      // Velocity → bend (signed). Subtract baseline so idle auto-spin
      // gives near-zero bend (cards stay flat) and only real wheel input
      // produces the sideways curl that Pacome's shader implements.
      const v = (scrollOffsetRef.current - prev) / Math.max(dt, 0.0001);
      const scrollV = v - AUTO_SPEED;
      // Tuning: 0.06 maps a few units/sec of velocity to a visible bend
      // amplitude matching Pacome's behaviour. Clamped to keep it sane.
      const targetBend = THREE.MathUtils.clamp(scrollV * 0.024, -0.14, 0.14);
      bendRef.current = THREE.MathUtils.damp(bendRef.current, targetBend, 6, dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const router = useRouter();
  const handleHover = (i: number | null) => {
    setHovered(i);
    onActiveChange?.(i);
  };
  const handleSelect = (i: number) => {
    const proj = PROJECTS[i];
    if (proj) router.push(`/projects/${proj.slug}`);
  };

  return (
    <div
      className="fixed inset-0 z-[1]"
      onClick={() => { if (visible) play("click"); }}
      style={{
        // Suppress pointer-events entirely when hidden so the list view (and
        // its hover effects) is fully interactive. Stays mounted so the
        // hide/reveal animation can play.
        pointerEvents: visible ? "auto" : "none",
        opacity: 1,
      }}
    >
      <Canvas
        // On phones the camera sits further back (and a tad wider FOV) so the
        // whole spiral fits the tall narrow viewport.
        camera={{ position: [0, 0, isMobile ? 8.4 : 6.2], fov: isMobile ? 58 : 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1} />
        <World
          scrollOffsetRef={scrollOffsetRef}
          wheelDeltaRef={wheelDeltaRef}
          bendRef={bendRef}
          visible={visible}
          isMobile={isMobile}
          onHover={handleHover}
          onSelect={handleSelect}
        />
      </Canvas>

      {/* Top + bottom vignette: cards fade into nothing at the edges */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-32 z-[2]"
        style={{
          background: "linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.85) 35%, rgba(10,10,10,0) 100%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-40 z-[2]"
        style={{
          background: "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.85) 35%, rgba(10,10,10,0) 100%)",
        }}
      />

      {/* Bottom-center tooltip with mini sticker + title */}
      <div
        className="pointer-events-none fixed z-20 flex items-center gap-2.5 pl-1.5 pr-5 py-1.5 rounded-full bg-white text-black text-[15px] font-medium whitespace-nowrap"
        style={{
          left: "50%",
          bottom: "36px",
          transform: `translateX(-50%) translateY(${hovered !== null ? "0" : "12px"})`,
          opacity: hovered !== null ? 1 : 0,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.05)",
          transition: "opacity 0.3s ease-out, transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
          fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {hovered !== null && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PROJECTS[hovered].sticker}
              alt=""
              className="w-9 h-9 rounded-full object-cover bg-gray-100"
            />
            <span>{PROJECTS[hovered].title}</span>
          </>
        )}
      </div>
    </div>
  );
}
