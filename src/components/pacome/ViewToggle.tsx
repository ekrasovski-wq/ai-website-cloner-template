"use client";

export type ViewMode = "spiral" | "list";

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

/**
 * Top-center spiral/list switch. Each label has two stacked copies that slide up
 * on hover, matching the original micro-interaction.
 */
export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="fixed top-[40px] left-1/2 -translate-x-1/2 z-30 flex items-center gap-[16px] text-[18px] leading-none font-medium select-none text-[#FAFAFA]">
      <ToggleButton
        label="spiral"
        active={mode === "spiral"}
        onClick={() => onChange("spiral")}
      />
      <span className="w-[6px] h-[6px] rounded-full bg-[#FAFAFA]" aria-hidden />
      <ToggleButton
        label="list"
        active={mode === "list"}
        onClick={() => onChange("list")}
      />
    </div>
  );
}

function ToggleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative h-[20px] overflow-hidden inline-flex items-start transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-50 hover:opacity-90"
      }`}
      style={{ width: `${label.length * 0.55}em` }}
    >
      <span
        aria-hidden
        className="flex flex-col leading-none transition-transform duration-[420ms]"
        style={{
          transitionTimingFunction: "cubic-bezier(0.22,0.61,0.36,1)",
        }}
      >
        <span className="block h-[20px]">{label}</span>
        <span className="block h-[20px]">{label}</span>
      </span>
      <span className="sr-only">{label}</span>
      <style jsx>{`
        button:hover span[aria-hidden] {
          transform: translateY(-20px);
        }
      `}</style>
    </button>
  );
}
