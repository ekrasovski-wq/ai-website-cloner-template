"use client";

// Résumé — a creative, animated CV page (experience, education, skills,
// languages). Reuses the site chrome (grid bg, top logo, morphing menu,
// sound toggle, Lenis) and the blonde mascot accent. Everything reveals on
// scroll; the experience reads as a glowing vertical timeline.

import { useState } from "react";
import { motion } from "motion/react";
import { MenuButton, MenuPanel } from "@/components/MenuPanel";
import { TopLogo } from "@/components/TopLogo";
import { SoundToggle } from "@/components/SoundToggle";
import { useLenis } from "@/lib/useLenis";

const ACCENT = "#edd262"; // blonde — matches the mascot logo
const SANS = 'Indivisible, "Helvetica Neue", Arial, sans-serif';

const ROLES = [
  "Brand & Visual Designer",
  "Brand Identity & Brand Books",
  "Georgian Type Design",
  "AI Visuals",
  "Lecturer at Skillwill",
];

const FACTS = [
  "Based in Tbilisi",
  "3+ years experience",
  "Open to remote · relocating to Spain",
];

const EXPERIENCE: { role: string; org: string; period: string; link?: string; points: string[] }[] = [
  {
    role: "Senior Graphic Designer",
    org: "Alien Lab",
    period: "Apr 2026 — Present",
    points: [
      "Visual design for Alien Lab, an AI creative studio — social campaigns, covers and carousels, motion loops and brand assets.",
      "Combine classic design craft with AI-generated imagery and video.",
    ],
  },
  {
    role: "Graphic Designer",
    org: "Mybusiness.ge",
    period: "May 2026 — Present",
    points: [
      "Brand designer for mybusiness.ge, Georgia's business marketplace.",
      "Built the full brand book — logo architecture, colour palette, typography system and guidelines — plus ongoing marketing and digital design.",
    ],
  },
  {
    role: "Graphic Designer",
    org: "Catwalk · catwalk.ge",
    period: "Sep 2026 — Present",
    link: "https://www.instagram.com/catwalk.ge",
    points: [
      "Graphic designer for Catwalk and Catwalk Men — posts, stories and print materials.",
      "Keep both brands visually consistent across social and print.",
    ],
  },
  {
    role: "Lecturer",
    org: "Skillwill Swiss College",
    period: "Nov 2025 — Present",
    points: [
      "Teach graphic design — typography, layout, branding and Adobe tools.",
      "Real client-style briefs and portfolio-ready projects, mentoring 320+ students.",
    ],
  },
  {
    role: "Graphic Designer",
    org: "Varketili Mall",
    period: "May 2026 — Sep 2026",
    points: [
      "Brand identity and image design — campaign and social visuals for the mall.",
    ],
  },
  {
    role: "Graphic Designer",
    org: "Urbanique",
    period: "Mar 2026 — Sep 2026",
    points: [
      "Social media and online graphics for the Urbanique brand.",
    ],
  },
  {
    role: "Graphic Designer",
    org: "Inoffice",
    period: "Feb 2026 — Sep 2026",
    points: [
      "Social media and computer-graphics design for Inoffice.",
    ],
  },
  {
    role: "Graphic Designer",
    org: "Gstore",
    period: "Apr 2025 — Feb 2026",
    points: [
      "Image design and artworking across the store's digital channels.",
    ],
  },
  {
    role: "Senior Graphic Designer",
    org: "Makler.ge",
    period: "Sep 2023 — Jul 2024",
    points: [
      "Artworking and online graphics for the Makler.ge marketplace.",
    ],
  },
];

const EDUCATION: { title: string; meta: string }[] = [
  { title: "Bachelor's Degree in Graphic Design", meta: "Caucasus University · Graduated" },
  { title: "Graphic Design Diploma", meta: "IT Step Academy · 2020 — 2022" },
  { title: "Adobe Certified Designer", meta: "Certification" },
];

const SKILLS = [
  "Brand Identity & Logo Design",
  "Brand Books",
  "Georgian Type Design",
  "AI Visuals",
  "Creative Direction",
  "Typography & Layout",
  "Social Media Design",
  "Motion Design",
  "Amazon A+ Content",
  "Design Education & Mentorship",
];

const TOOLS = [
  "Illustrator",
  "Photoshop",
  "InDesign",
  "Figma",
  "After Effects",
  "Google Workspace",
];

const LANGUAGES: { name: string; level: string; pct: number }[] = [
  { name: "Georgian", level: "Native", pct: 100 },
  { name: "English", level: "Professional Working", pct: 80 },
  { name: "Russian", level: "Elementary · A2", pct: 35 },
  { name: "Spanish", level: "Elementary · A1", pct: 25 },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0, y = 26 }: { children: React.ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ no, title }: { no: string; title: string }) {
  return (
    <Reveal>
      <div className="flex items-baseline gap-4 mb-10">
        <span
          className="text-[13px] tracking-[0.25em] font-medium tabular-nums"
          style={{ color: ACCENT, fontFamily: SANS }}
        >
          {no}
        </span>
        <h2
          className="text-[clamp(26px,5vw,44px)] font-medium tracking-tight text-white"
          style={{ fontFamily: SANS }}
        >
          {title}
        </h2>
        <span className="flex-1 h-px bg-white/10 translate-y-[-6px]" />
      </div>
    </Reveal>
  );
}

export default function ResumePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  useLenis();

  return (
    <main className="relative min-h-screen w-full bg-[var(--page-bg)] overflow-x-clip">
      <div className="grid-bg" />
      <TopLogo />
      <MenuButton open={menuOpen} setOpen={setMenuOpen} />
      <MenuPanel open={menuOpen} setOpen={setMenuOpen} />

      <section className="relative z-10 mx-auto w-full max-w-[1000px] px-6 pt-32 pb-28 sm:pt-40">
        {/* ===== Hero ===== */}
        <header className="mb-24 sm:mb-32">
          <Reveal>
            <p
              className="text-[12px] sm:text-[13px] tracking-[0.3em] uppercase mb-6"
              style={{ color: ACCENT, fontFamily: SANS }}
            >
              Résumé — {new Date().getFullYear()}
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1
              className="font-medium tracking-[-0.03em] leading-[0.92] text-white"
              style={{ fontFamily: SANS, fontSize: "clamp(44px, 11vw, 132px)" }}
            >
              Elene
              <br />
              <span className="text-white/55">Krasowski</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-8 flex flex-wrap gap-x-3 gap-y-2">
              {ROLES.map((r, i) => (
                <span key={r} className="flex items-center gap-3">
                  {i > 0 && <span className="w-1 h-1 rounded-full" style={{ background: ACCENT }} />}
                  <span className="text-white/80 text-[14px] sm:text-[16px]" style={{ fontFamily: SANS }}>
                    {r}
                  </span>
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-10 max-w-[640px] text-white/55 text-[16px] sm:text-[18px] leading-[1.6]">
              Brand &amp; visual designer specialising in brand identities, brand books,
              Georgian type design and AI-driven visuals. Building complete brand systems
              for Georgian and international clients — and teaching the next generation of
              designers at Skillwill.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap gap-2.5">
              {FACTS.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[12.5px] text-white/70"
                  style={{ fontFamily: SANS }}
                >
                  {f}
                </span>
              ))}
            </div>
          </Reveal>
        </header>

        {/* ===== Experience (timeline) ===== */}
        <div className="mb-24 sm:mb-32">
          <SectionHeader no="01" title="Experience" />

          <div className="relative pl-8 sm:pl-12">
            {/* glowing spine */}
            <span
              aria-hidden
              className="absolute left-[5px] sm:left-[9px] top-2 bottom-2 w-px"
              style={{
                background: `linear-gradient(to bottom, ${ACCENT}, ${ACCENT}22 70%, transparent)`,
                boxShadow: `0 0 12px ${ACCENT}55`,
              }}
            />
            <div className="flex flex-col gap-11 sm:gap-14">
              {EXPERIENCE.map((job, i) => (
                <Reveal key={job.role + job.org} delay={i * 0.04}>
                  <div className="relative">
                    {/* dot on the spine */}
                    <span
                      aria-hidden
                      className="absolute top-1.5 w-[11px] h-[11px] rounded-full border-2"
                      style={{
                        left: "calc(-2rem - 0px)",
                        borderColor: ACCENT,
                        background: "#0a0a0a",
                        boxShadow: `0 0 10px ${ACCENT}88`,
                      }}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6">
                      <h3 className="text-[20px] sm:text-[24px] font-medium text-white tracking-tight" style={{ fontFamily: SANS }}>
                        {job.role}
                      </h3>
                      <span className="text-[12.5px] tracking-[0.12em] uppercase text-white/40 shrink-0 tabular-nums" style={{ fontFamily: SANS }}>
                        {job.period}
                      </span>
                    </div>
                    {job.link ? (
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-[15px] sm:text-[16px] underline-offset-4 hover:underline"
                        style={{ color: ACCENT, fontFamily: SANS }}
                      >
                        {job.org} ↗
                      </a>
                    ) : (
                      <p className="mt-1 text-[15px] sm:text-[16px]" style={{ color: ACCENT, fontFamily: SANS }}>
                        {job.org}
                      </p>
                    )}
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {job.points.map((p, j) => (
                        <li key={j} className="flex gap-3 text-white/55 text-[14.5px] sm:text-[15.5px] leading-[1.55]">
                          <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-white/25 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Education + Languages (two columns) ===== */}
        <div className="mb-24 sm:mb-32 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-20">
          {/* Education */}
          <div>
            <SectionHeader no="02" title="Education" />
            <div className="flex flex-col gap-4">
              {EDUCATION.map((e, i) => (
                <Reveal key={e.title} delay={i * 0.05}>
                  <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.04]">
                    <h3 className="text-[17px] sm:text-[18px] font-medium text-white tracking-tight" style={{ fontFamily: SANS }}>
                      {e.title}
                    </h3>
                    <p className="mt-1.5 text-[13.5px] text-white/50" style={{ fontFamily: SANS }}>
                      {e.meta}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <SectionHeader no="03" title="Languages" />
            <div className="flex flex-col gap-7">
              {LANGUAGES.map((l, i) => (
                <Reveal key={l.name} delay={i * 0.06}>
                  <div>
                    <div className="flex items-baseline justify-between mb-2.5">
                      <span className="text-[16px] sm:text-[17px] text-white" style={{ fontFamily: SANS }}>{l.name}</span>
                      <span className="text-[12.5px] text-white/45" style={{ fontFamily: SANS }}>{l.level}</span>
                    </div>
                    <div className="h-[6px] rounded-full bg-white/8 overflow-hidden">
                      <motion.span
                        className="block h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}aa)` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${l.pct}%` }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 1, ease: EASE, delay: 0.15 + i * 0.08 }}
                      />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Skills + Tools ===== */}
        <div className="mb-20">
          <SectionHeader no="04" title="Skills & Tools" />
          <Reveal>
            <div className="flex flex-wrap gap-2.5 mb-8">
              {SKILLS.map((s) => (
                <span
                  key={s}
                  className="skill-chip rounded-full border border-white/12 bg-white/[0.03] px-4 py-2.5 text-[13.5px] text-white/75"
                  style={{ fontFamily: SANS }}
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex flex-wrap gap-2.5">
              {TOOLS.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-4 py-2.5 text-[13.5px] font-medium text-black"
                  style={{ fontFamily: SANS, background: ACCENT }}
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ===== Footer CTA ===== */}
        <Reveal>
          <div className="mt-24 pt-10 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <p className="text-white/50 text-[15px]" style={{ fontFamily: SANS }}>
              Let&rsquo;s build something.
            </p>
            <a
              href="mailto:Krasowskielene@gmail.com"
              className="text-white text-[22px] sm:text-[28px] font-medium tracking-tight hover:opacity-70 transition-opacity break-words"
              style={{ fontFamily: SANS }}
            >
              Krasowskielene@gmail.com
            </a>
          </div>
        </Reveal>
      </section>

      <SoundToggle />

      <style jsx global>{`
        .skill-chip { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, background 0.3s ease; }
        .skill-chip:hover { transform: translateY(-3px); border-color: ${ACCENT}; color: #fff; }
      `}</style>
    </main>
  );
}
