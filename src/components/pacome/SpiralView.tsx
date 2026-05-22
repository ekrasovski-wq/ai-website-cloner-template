"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects, spiralLayout } from "@/lib/projects";

interface SpiralViewProps {
  active: boolean;
}

export function SpiralView({ active }: SpiralViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMouse({
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      });
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-10 transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        perspective: "1400px",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(${mouse.x * -20}px, ${mouse.y * -14}px, 0) rotateY(${
            mouse.x * 4
          }deg) rotateX(${mouse.y * -3}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 320ms cubic-bezier(0.22,0.61,0.36,1)",
        }}
      >
        {projects.map((project, i) => {
          const pos = spiralLayout[i % spiralLayout.length];
          const ratio = project.height / project.width;
          const h = pos.w * ratio;
          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              aria-label={project.title}
              className="group absolute block"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: pos.w,
                height: h,
                marginLeft: -pos.w / 2,
                marginTop: -h / 2,
                zIndex: pos.z,
                transform: `rotateZ(${pos.rotZ}deg) rotateY(${pos.rotY}deg)`,
                animation: `float-card 7s ease-in-out ${pos.delay}s infinite alternate`,
                ["--rest" as never]: `rotateZ(${pos.rotZ}deg) rotateY(${pos.rotY}deg) translateY(0px)`,
                ["--peak" as never]: `rotateZ(${pos.rotZ + 1.5}deg) rotateY(${pos.rotY - 2}deg) translateY(-14px)`,
              }}
            >
              <div
                className="relative w-full h-full overflow-hidden rounded-[8px] shadow-[0_24px_60px_rgba(0,0,0,0.55)] transition-transform duration-400 group-hover:scale-[1.06]"
                style={{ backgroundColor: project.dominantBg }}
              >
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  sizes="320px"
                  className="object-cover"
                  priority={i < 5}
                />
              </div>
              <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-[26px] text-[13px] text-[#FAFAFA] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {project.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
