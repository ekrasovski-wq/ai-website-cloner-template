"use client";

// Works page — 3D folder categories (reactbits "3d-folder"). Each folder is a
// category (Logos, Banners, Branding, ...) that fans out preview cards on
// hover; clicking a card opens a lightbox gallery. Category name sits below.

import { useState } from "react";
import { MenuButton, MenuPanel } from "@/components/MenuPanel";
import { TopLogo } from "@/components/TopLogo";
import { SoundToggle } from "@/components/SoundToggle";
import { AnimatedFolder, type FolderProject } from "@/components/Folder3D";
import { PROJECTS } from "@/lib/projects";
import { useLenis } from "@/lib/useLenis";

// Build category folders. Re-uses project thumbnails so the previews are
// real; each category has its own accent gradient.
// Muted but clearly coloured palette — desaturated, deep tones (not neon,
// not flat grey) so each folder has its own identity like the reference.
const CATEGORIES: { title: string; gradient: string; projects: FolderProject[] }[] = [
  {
    title: "Logos",
    gradient: "linear-gradient(160deg, #c2603a, #9c4528)",   // muted terracotta
    projects: Array.from({ length: 8 }, (_, i) => ({
      id: `logo-${i + 1}`,
      image: `/images/logos/logo-${i + 1}.jpg`,
      title: `Logo ${i + 1}`,
    })),
  },
  {
    title: "Branding",
    gradient: "linear-gradient(160deg, #4a5a86, #33405f)",   // muted indigo
    projects: PROJECTS.slice(4, 9).map((p) => ({ id: `brand-${p.id}`, image: p.sticker, title: p.title, link: p.pdf })),
  },
  {
    title: "Posts",
    gradient: "linear-gradient(160deg, #e08a1e, #b86a12)",   // brand orange
    projects: Array.from({ length: 12 }, (_, i) => ({
      id: `post-${i + 1}`,
      image: `/images/posts/post-${i + 1}.jpg`,
      title: `Post ${i + 1}`,
    })),
  },
  {
    title: "AI",
    gradient: "linear-gradient(160deg, #5a4a86, #3a2f5f)",   // muted violet
    projects: [
      { id: "ai-catwalk", image: "/images/ai/catwalk.jpg", title: "Catwalk", video: "/videos/catwalk.mp4" },
      { id: "ai-alienlab", image: "/images/ai/alienlab.jpg", title: "Alienlab", video: "/videos/alienlab.mp4" },
      { id: "ai-urbanique", image: "/images/ai/finalcomp2.jpg", title: "Urbanique", video: "/videos/finalcomp2.mp4" },
    ],
  },
];

export default function WorksPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  useLenis();

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <div className="grid-bg" />
      <TopLogo />
      <MenuButton open={menuOpen} setOpen={setMenuOpen} />
      <MenuPanel open={menuOpen} setOpen={setMenuOpen} />

      <section className="relative z-10 mx-auto max-w-[1280px] px-6 pt-28 pb-32">
        <h1
          className="mb-14 text-[clamp(40px,6vw,80px)] font-medium tracking-tight text-white"
          style={{ fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif' }}
        >
          works
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
          {CATEGORIES.map((cat) => (
            <AnimatedFolder
              key={cat.title}
              title={cat.title}
              projects={cat.projects}
              gradient={cat.gradient}
              className="w-full"
            />
          ))}
        </div>
      </section>

      <SoundToggle />
    </main>
  );
}
