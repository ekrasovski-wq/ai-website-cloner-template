"use client";
import { useState } from "react";
import { play, startAmbient, setMuted } from "@/lib/sounds";
import { Mascot3D } from "./Mascot3D";

export function EntryOverlay({ onEnter }: { onEnter: () => void }) {
  const [hidden, setHidden] = useState(false);

  const enter = (withSound: boolean) => {
    play("click");
    if (withSound) {
      setMuted(false);
      setTimeout(() => startAmbient(), 200);
    } else {
      setMuted(true);
    }
    setHidden(true);
    setTimeout(onEnter, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-black transition-opacity duration-500 ease-out ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="mb-2">
        <Mascot3D size={110} />
      </div>
      <div className="mb-6 text-[15px] tracking-wide text-white/90 text-center leading-tight">
        Brand and visual designer
        <br />based in tbilisi
      </div>
      <div className="flex gap-8 items-center text-[15px] mt-4">
        <button
          className="button enter px-5 py-2 rounded-full bg-white text-black hover:scale-[1.03] transition-transform"
          onClick={() => enter(true)}
          onMouseEnter={() => play("hover")}
        >
          <span className="hidden-label">enter with sound</span>
          <span aria-hidden>enter&nbsp;with&nbsp;sound</span>
        </button>
        <button
          className="text-white/70 hover:text-white transition-colors"
          onClick={() => enter(false)}
          onMouseEnter={() => play("hover")}
        >
          enter without sound
        </button>
      </div>
    </div>
  );
}
