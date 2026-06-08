"use client";
export function ShowreelMarquee() {
  const item = (
    <span className="inline-flex items-center gap-3 mx-3 text-[13px] tracking-wide uppercase text-white/70">
      showreel <span className="inline-block">✲</span> 2025 <span className="inline-block">✲</span>
    </span>
  );
  // 8 repeats so the loop is seamless
  return (
    <div
      className="fixed left-[-40px] bottom-[40px] z-10 pointer-events-none origin-bottom-left"
      style={{ width: "60vw", transform: "rotate(-22deg)" }}
    >
      <div className="overflow-hidden">
        <div className="marquee-track whitespace-nowrap">
          {Array.from({ length: 12 }).map((_, i) => <span key={i}>{item}</span>)}
        </div>
      </div>
    </div>
  );
}
