"use client";

// Contact page — draggable 3D badge (Lanyard) + email CTA + social links,
// in the site style (#0a0a0a, dotted grid, Indivisible type).

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MenuButton, MenuPanel } from "@/components/MenuPanel";
import { TopLogo } from "@/components/TopLogo";
import { SoundToggle } from "@/components/SoundToggle";
import { play } from "@/lib/sounds";
import { useLenis } from "@/lib/useLenis";

// Draggable 3D badge — client-only (WebGL + physics).
const Lanyard = dynamic(() => import("@/components/Lanyard"), { ssr: false });

const EMAIL = "Krasowskielene@gmail.com";
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/krasowski.jpg/" },
  { label: "Behance", href: "https://www.behance.net/elenekrasovski" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/elene-krasovski-089b6821b/" },
];

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useLenis();
  useEffect(() => { setMounted(true); }, []);

  const fadeUp = (i: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.6s ease ${0.1 + i * 0.08}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.08}s`,
  });

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <div className="grid-bg" />
      <TopLogo />
      <MenuButton open={menuOpen} setOpen={setMenuOpen} />
      <MenuPanel open={menuOpen} setOpen={setMenuOpen} />

      {/* Draggable 3D badge fills the screen behind/around the contact text */}
      <div className="absolute inset-0 z-0">
        <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} fov={20} />
      </div>

      <section className="relative z-10 flex flex-col items-center justify-end min-h-screen px-6 pb-8 text-center pointer-events-none">
        <p className="text-white/50 text-[16px] mb-5" style={fadeUp(0)}>
          let&rsquo;s work together
        </p>

        <a
          href={`mailto:${EMAIL}`}
          onMouseEnter={() => play("hover")}
          onClick={() => play("click")}
          className="text-white hover:text-white/60 transition-colors break-all pointer-events-auto"
          style={{
            ...fadeUp(1),
            fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif',
            fontWeight: 500,
            fontSize: "clamp(24px, 4vw, 52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {EMAIL}
        </a>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pointer-events-auto" style={fadeUp(2)}>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
              className="text-white/70 hover:text-white transition-colors text-[17px]"
              style={{ fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif' }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <SoundToggle />
    </main>
  );
}
