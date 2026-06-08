"use client";
import { useState, useEffect, useRef } from "react";
import InfiniteMenu from "./InfiniteMenu";
import { PROJECTS } from "@/lib/projects";
import { play } from "@/lib/sounds";

interface MenuItem {
  image: string;
  link: string;
  title: string;
  description: string;
}

export function ProjectsSphere() {
  // Build the items list once per render
  const items: MenuItem[] = PROJECTS.map((p) => ({
    image: p.sticker,
    link: "#",
    title: p.title,
    description: "",
  }));

  const [active, setActive] = useState<MenuItem | null>(items[0] || null);
  const [moving, setMoving] = useState(false);
  const previousActive = useRef<string | null>(null);

  useEffect(() => {
    if (!active) return;
    if (previousActive.current !== active.title) {
      previousActive.current = active.title;
      // Play a tick when the sphere snaps to a new face
      play("tick");
    }
  }, [active]);

  useEffect(() => {
    // Drag start = click sound, drag end = subtle close sound
    if (moving) play("hover");
  }, [moving]);

  // Find the matching project so we can show the mini sticker in the tooltip
  const matchingProject = active ? PROJECTS.find((p) => p.title === active.title) : null;

  return (
    <div className="fixed inset-0 z-0">
      <InfiniteMenu
        items={items}
        scale={1.0}
        onActiveItemChange={setActive}
        onMovingChange={setMoving}
      />

      {/* Bottom-center tooltip: white pill with mini preview + title */}
      <div
        className="pointer-events-none fixed z-20 flex items-center gap-2.5 pl-1.5 pr-5 py-1.5 rounded-full bg-white text-black text-[15px] font-medium whitespace-nowrap"
        style={{
          left: "50%",
          bottom: "36px",
          transform: `translateX(-50%) translateY(${active && !moving ? "0" : "12px"})`,
          opacity: active && !moving ? 1 : 0,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.05)",
          transition: "opacity 0.3s ease-out, transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
          fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {matchingProject && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={matchingProject.sticker}
              alt=""
              className="w-9 h-9 rounded-full object-cover bg-gray-100"
            />
            <span>{matchingProject.title}</span>
          </>
        )}
      </div>
    </div>
  );
}
