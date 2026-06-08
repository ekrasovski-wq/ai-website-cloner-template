"use client";
import { useState } from "react";
import { setMuted, play } from "@/lib/sounds";

export function SoundToggle() {
  const [on, setOn] = useState(true);
  const toggle = () => {
    const next = !on;
    setOn(next);
    setMuted(!next);
    if (next) play("click");
  };
  return (
    <button
      onClick={toggle}
      className="fixed right-[30px] bottom-[30px] z-20 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
      aria-label={on ? "mute" : "unmute"}
    >
      {on ? (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
          <path d="M16 8c1.5 1.2 1.5 6.8 0 8" />
          <path d="M19 5c3 3 3 11 0 14" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
          <path d="M16 9l5 6M21 9l-5 6" />
        </svg>
      )}
    </button>
  );
}
