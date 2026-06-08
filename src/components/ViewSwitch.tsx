"use client";
import { play } from "@/lib/sounds";

export type ViewMode = "spiral" | "list";

export function ViewSwitch({
  mode, onChange,
}: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  const set = (m: ViewMode) => {
    if (m === mode) return;
    play("switch");
    play(m === "spiral" ? "spiral" : "list");
    onChange(m);
  };

  return (
    <div className="fixed top-[26px] left-1/2 -translate-x-1/2 z-20 select-none">
      <div className="flex items-center gap-3 text-[15px]" style={{ fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif' }}>
        <button
          className={`transition-colors duration-300 ${mode === "spiral" ? "text-white" : "text-white/40 hover:text-white/70"}`}
          onMouseEnter={() => play("hover")}
          onClick={() => set("spiral")}
        >
          spiral
        </button>

        {/* iOS-style toggle. Knob slides left (spiral) / right (list). */}
        <button
          role="switch"
          aria-checked={mode === "list"}
          onClick={() => set(mode === "spiral" ? "list" : "spiral")}
          onMouseEnter={() => play("hover")}
          className="relative w-[44px] h-[24px] rounded-full transition-colors duration-300"
          style={{ background: "#ffffff" }}
        >
          <span
            className="absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-black"
            style={{
              left: mode === "spiral" ? "3px" : "calc(100% - 21px)",
              transition: "left 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
            }}
          />
        </button>

        <button
          className={`transition-colors duration-300 ${mode === "list" ? "text-white" : "text-white/40 hover:text-white/70"}`}
          onMouseEnter={() => play("hover")}
          onClick={() => set("list")}
        >
          list
        </button>
      </div>
    </div>
  );
}
