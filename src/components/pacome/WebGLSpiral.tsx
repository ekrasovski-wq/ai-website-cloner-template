"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";

interface WebGLSpiralProps {
  active: boolean;
}

/**
 * Three.js spiral scene mirroring pacomepertant.com.
 * - Project cards float on a 3D helix
 * - Mouse parallax on the camera
 * - Scroll wheel drives the helix rotation (with inertia)
 * - Click on the canvas raycasts cards -> navigate to /projects/[slug]
 */
export function WebGLSpiral({ active }: WebGLSpiralProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const activeRef = useRef(active);

  // keep the latest `active` flag visible to event handlers
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();

    // ----- Camera -----
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 18);

    // ----- Renderer -----
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    // ----- Build helix of project cards -----
    const loader = new THREE.TextureLoader();
    const group = new THREE.Group();
    scene.add(group);

    type CardEntry = {
      mesh: THREE.Mesh;
      slug: string;
      baseY: number;
      baseAngle: number;
      floatPhase: number;
    };
    const cards: CardEntry[] = [];

    const radius = 7;
    const turns = 1.4;
    const total = projects.length;

    projects.forEach((project, i) => {
      const t = i / Math.max(1, total - 1);
      const angle = t * Math.PI * 2 * turns - Math.PI * 0.7;
      const yRange = 9;
      const y = (0.5 - t) * yRange;

      const aspect = project.width / project.height;
      const cardHeight = 2.5;
      const cardWidth = cardHeight * aspect;

      const geom = new THREE.PlaneGeometry(cardWidth, cardHeight, 1, 1);

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(project.dominantBg),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geom, material);
      mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      mesh.userData = { slug: project.slug, index: i };
      mesh.lookAt(0, y * 0.4, 0);

      const tiltZ = (Math.sin(i * 1.3) * 6) * (Math.PI / 180);
      const tiltY = (Math.cos(i * 0.9) * 4) * (Math.PI / 180);
      mesh.rotation.z += tiltZ;
      mesh.rotation.y += tiltY;

      group.add(mesh);

      cards.push({
        mesh,
        slug: project.slug,
        baseY: y,
        baseAngle: angle,
        floatPhase: i * 0.6,
      });

      loader.load(
        project.thumbnailUrl,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          mesh.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            toneMapped: false,
          });
          const start = performance.now();
          const fadeIn = () => {
            const elapsed = performance.now() - start;
            const op = Math.min(1, elapsed / 600);
            (mesh.material as THREE.MeshBasicMaterial).opacity = op;
            if (op < 1) requestAnimationFrame(fadeIn);
          };
          requestAnimationFrame(fadeIn);
        },
        undefined,
        () => {
          (mesh.material as THREE.MeshBasicMaterial).opacity = 1;
        }
      );
    });

    // ----- Pointer + interaction state -----
    const pointer = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    let hovered: THREE.Mesh | null = null;

    // Scroll-driven rotation state
    let targetRotation = 0;
    let currentRotation = 0;

    function onPointerMove(e: PointerEvent) {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.set(x, y);
    }

    function onCanvasClick(e: MouseEvent) {
      // Only navigate when the spiral is the active view and the click landed
      // on the canvas (not bubbled from an overlay).
      if (!activeRef.current) return;
      if (e.target !== canvas) return;
      if (!hovered) return;
      const slug = (hovered.userData as { slug?: string }).slug;
      if (slug) router.push(`/projects/${slug}`);
    }

    function onWheel(e: WheelEvent) {
      if (!activeRef.current) return;
      // Normalise deltaY so trackpad + mousewheel feel similar
      const sign = Math.sign(e.deltaY);
      const magnitude = Math.min(Math.abs(e.deltaY), 100);
      targetRotation += sign * magnitude * 0.0035;
    }

    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("click", onCanvasClick);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize);

    // ----- Animation loop -----
    const clock = new THREE.Clock();
    let raf = 0;

    const tick = () => {
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Mouse parallax (eased)
      target.x += (pointer.x - target.x) * 0.06;
      target.y += (pointer.y - target.y) * 0.06;

      camera.position.x = target.x * 1.5;
      camera.position.y = target.y * 1.0;
      camera.lookAt(0, target.y * 0.3, 0);

      // Idle drift + scroll-driven rotation (smooth toward target)
      targetRotation += dt * 0.04;
      currentRotation += (targetRotation - currentRotation) * 0.08;
      group.rotation.y = currentRotation;

      cards.forEach((c) => {
        const f = Math.sin(elapsed * 0.6 + c.floatPhase) * 0.12;
        c.mesh.position.y = c.baseY + f;
      });

      // Hover detection only when active
      if (activeRef.current) {
        raycaster.setFromCamera(pointer, camera);
        const meshes = cards.map((c) => c.mesh);
        const hits = raycaster.intersectObjects(meshes, false);
        if (hits.length > 0) {
          const hit = hits[0].object as THREE.Mesh;
          if (hovered !== hit) {
            hovered = hit;
            canvas.style.cursor = "pointer";
          }
        } else if (hovered) {
          hovered = null;
          canvas.style.cursor = "default";
        }
      } else if (hovered) {
        hovered = null;
        canvas.style.cursor = "default";
      }

      cards.forEach((c) => {
        const targetScale = c.mesh === hovered ? 1.08 : 1.0;
        c.mesh.scale.x += (targetScale - c.mesh.scale.x) * 0.12;
        c.mesh.scale.y += (targetScale - c.mesh.scale.y) * 0.12;
        c.mesh.scale.z += (targetScale - c.mesh.scale.z) * 0.12;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("click", onCanvasClick);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      cards.forEach((c) => {
        c.mesh.geometry.dispose();
        const mat = c.mesh.material as THREE.Material & {
          map?: THREE.Texture | null;
        };
        if (mat.map) mat.map.dispose();
        mat.dispose();
      });
      renderer.dispose();
    };
  }, [router]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-10 transition-opacity duration-700 ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      data-engine="three.js"
    />
  );
}
