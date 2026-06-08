"use client";
import { useRef, useState } from "react";
import { FileText } from "lucide-react";
import { MenuButton, MenuPanel } from "@/components/MenuPanel";
import { TopLogo } from "@/components/TopLogo";
import { SoundToggle } from "@/components/SoundToggle";
import VariableProximity from "@/components/VariableProximity";
import { ToolsCloud } from "@/components/ToolsCloud";
import { play } from "@/lib/sounds";
import { useLenis } from "@/lib/useLenis";

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  useLenis();

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <div className="grid-bg" />
      <TopLogo />
      <MenuButton open={menuOpen} setOpen={setMenuOpen} />
      <MenuPanel open={menuOpen} setOpen={setMenuOpen} />

      {/* About text — letters thicken as the cursor approaches them. */}
      <section className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div ref={textRef} style={{ position: "relative" }} className="max-w-[860px] text-center">
          <VariableProximity
            label={
              "I’m Elene Krasowski, a visual and UI/UX designer based in Tbilisi. I craft interfaces and brand identities that balance form and function. Always exploring layout, typography, and spatial design across digital and 3D spaces. Minimalist at times, bold at others."
            }
            fromFontVariationSettings="'wght' 400, 'opsz' 12"
            toFontVariationSettings="'wght' 900, 'opsz' 90"
            containerRef={textRef as React.RefObject<HTMLElement>}
            radius={140}
            falloff="gaussian"
            className="text-white/70 leading-[1.5]"
            style={{
              fontSize: "30px",
              // Roboto Flex is a true variable font → wght axis actually
              // animates. Indivisible was static so the effect was invisible.
              fontFamily: '"Roboto Flex", "Helvetica Neue", Arial, sans-serif',
            }}
          />

          {/* Tools / platforms I work with — floating badges near the text. */}
          <ToolsCloud />

          {/* Small CV link */}
          <div className="mt-10 flex justify-center">
            <a
              href="/Krasovski-CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[13px] font-medium text-white/70 transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
              style={{ fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif' }}
            >
              <FileText className="w-4 h-4" strokeWidth={2} />
              View CV
            </a>
          </div>
        </div>
      </section>

      <SoundToggle />
    </main>
  );
}
