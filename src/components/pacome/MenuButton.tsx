"use client";

interface MenuButtonProps {
  open: boolean;
  onToggle: () => void;
}

/**
 * Top-right pill button. Letters of "menu" slide up by one row on hover.
 */
export function MenuButton({ open, onToggle }: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      className={`pill-btn fixed top-[26px] right-[26px] z-40 h-[44px] px-[22px] text-[16px] overflow-hidden ${
        open ? "opacity-0 pointer-events-none scale-95" : "opacity-100"
      }`}
    >
      <LetterStack text="menu" />
    </button>
  );
}

function LetterStack({ text }: { text: string }) {
  return (
    <span className="relative inline-flex h-[18px] overflow-hidden leading-none">
      <span
        aria-hidden
        className="flex flex-col transition-transform duration-[420ms]"
        style={{ transitionTimingFunction: "cubic-bezier(0.22,0.61,0.36,1)" }}
      >
        <span className="flex items-center h-[18px]">{text}</span>
        <span className="flex items-center h-[18px]">{text}</span>
      </span>
      <span className="sr-only">{text}</span>
      <style jsx>{`
        :global(.pill-btn:hover) span[aria-hidden] {
          transform: translateY(-18px);
        }
      `}</style>
    </span>
  );
}
