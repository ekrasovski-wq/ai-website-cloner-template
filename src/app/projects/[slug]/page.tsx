"use client";

// Project detail page — mirrors pacomepertant.com's /projects/[slug].
// Layout: large hero image, title + year + short description, then a
// scrollable gallery of styleframes, and a "next project" link.
// Entrance animation: content fades/slides up in a short cascade.

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getNextProject } from "@/lib/projects";
import { play } from "@/lib/sounds";

export default function ProjectPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const project = getProjectBySlug(slug);
  const next = getNextProject(slug);
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Exit animation: fade/slide everything down, then navigate home.
  const goBack = () => {
    play("close");
    setLeaving(true);
    setTimeout(() => router.push("/"), 450);
  };

  if (!project) {
    return (
      <main className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-2xl">Project not found.</p>
      </main>
    );
  }

  // `show` is true only while mounted AND not leaving — drives both the
  // entrance cascade and the reverse exit animation.
  const show = mounted && !leaving;
  const fadeUp = (i: number): React.CSSProperties => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0)" : "translateY(24px)",
    transition: leaving
      ? `opacity 0.35s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)`
      : `opacity 0.6s ease ${0.1 + i * 0.08}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.08}s`,
  });

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white">
      <div className="grid-bg" />

      {/* Back button */}
      <button
        onClick={goBack}
        onMouseEnter={() => play("hover")}
        className="fixed top-6 left-6 z-20 flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-[15px] font-medium hover:scale-[1.04] transition-transform"
        style={{ fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif' }}
      >
        ← back
      </button>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pt-28 pb-24">
        {/* Title block */}
        <div className="mb-10" style={fadeUp(0)}>
          <h1
            className="text-[clamp(40px,7vw,96px)] leading-[1.02] tracking-tight font-medium"
            style={{ fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif' }}
          >
            {project.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-6 text-white/60 text-[16px]">
            <span>{project.year}</span>
            <span>{project.shortDescription}</span>
            {project.pdf && (
              <a
                href={project.pdf}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => play("hover")}
                className="rounded-full border border-white/25 px-4 py-1.5 text-[14px] text-white hover:bg-white hover:text-black transition-colors"
              >
                View full PDF →
              </a>
            )}
          </div>
        </div>

        {/* Hero image */}
        <div
          className="w-full overflow-hidden rounded-2xl mb-6"
          style={{ ...fadeUp(1), aspectRatio: "16 / 9" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.styleframes[0]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Styleframe gallery */}
        <div className="flex flex-col gap-6">
          {project.styleframes.slice(1).map((src, i) => (
            <div
              key={src}
              className="w-full overflow-hidden rounded-2xl"
              style={{ ...fadeUp(2 + i), aspectRatio: "16 / 9" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Next project */}
        {next && (
          <Link
            href={`/projects/${next.slug}`}
            onMouseEnter={() => play("hover")}
            onClick={() => play("longclick")}
            className="mt-20 flex items-center justify-between border-t border-white/15 pt-8 group"
            style={fadeUp(2 + project.styleframes.length)}
          >
            <span className="text-white/50 text-[15px]">next project</span>
            <span
              className="text-[clamp(28px,4vw,56px)] font-medium tracking-tight group-hover:text-white/60 transition-colors"
              style={{ fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif' }}
            >
              {next.title} →
            </span>
          </Link>
        )}
      </div>
    </main>
  );
}
