"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { EntryOverlay } from "@/components/EntryOverlay";
import { ProjectsList } from "@/components/ProjectsList";

// The 3D spiral pulls in three.js / r3f (~1MB). Load it as its own chunk so
// the entry splash + page shell paint immediately instead of waiting on it.
const ProjectsCarousel3D = dynamic(
  () => import("@/components/ProjectsCarousel3D").then((m) => m.ProjectsCarousel3D),
  { ssr: false },
);
import { ViewSwitch, type ViewMode } from "@/components/ViewSwitch";
import { MenuButton, MenuPanel } from "@/components/MenuPanel";
import { SoundToggle } from "@/components/SoundToggle";
import { TopLogo } from "@/components/TopLogo";
import { useLenis } from "@/lib/useLenis";

export default function Home() {
  // Once the user has clicked "enter", remember it for the session so that
  // returning from a /projects/[slug] page goes straight to the spiral
  // instead of flashing the entry overlay again.
  //
  // `entered` starts as null (unknown) until we've read sessionStorage in the
  // effect below. Rendering nothing during that single frame avoids the
  // overlay flicker on back-navigation.
  const [entered, setEntered] = useState<boolean | null>(null);
  const [mode, setMode] = useState<ViewMode>("spiral");
  const [menuOpen, setMenuOpen] = useState(false);
  useLenis();

  useEffect(() => {
    setEntered(sessionStorage.getItem("pacome-entered") === "1");
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem("pacome-entered", "1");
    setEntered(true);
  };

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <div className="grid-bg" />

      {entered === true && (
        <>
          {/* Both views are mounted at once; each handles its own enter/exit
              animation via the `visible` prop. The spiral plays its reverse
              hide-animation when mode flips to list, instead of unmounting. */}
          <ProjectsCarousel3D visible={mode === "spiral"} />
          <ProjectsList visible={mode === "list"} />
          <TopLogo />
          <ViewSwitch mode={mode} onChange={setMode} />
          <MenuButton open={menuOpen} setOpen={setMenuOpen} />
          <MenuPanel open={menuOpen} setOpen={setMenuOpen} />
          <SoundToggle />
        </>
      )}

      {/* Only show the entry overlay once we KNOW the user hasn't entered yet
          (entered === false). While null, render just the background so the
          overlay never flashes on back-navigation. */}
      {entered === false && <EntryOverlay onEnter={handleEnter} />}
    </main>
  );
}
