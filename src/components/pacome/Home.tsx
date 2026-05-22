"use client";

import { useState } from "react";
import { BackgroundPattern } from "./BackgroundPattern";
import { SoundGate } from "./SoundGate";
import { Logo } from "./Logo";
import { ViewToggle, type ViewMode } from "./ViewToggle";
import { MenuButton } from "./MenuButton";
import { MenuPanel } from "./MenuPanel";
import { ShowreelLabel } from "./ShowreelLabel";
import { SoundToggle } from "./SoundToggle";
import { WebGLSpiral } from "./WebGLSpiral";
import { ListView } from "./ListView";

export function Home() {
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(true);
  const [view, setView] = useState<ViewMode>("spiral");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A]">
      {/* Persistent SVG vignette/grid background */}
      <BackgroundPattern />

      {/* WebGL spiral always present once entered — z-10 sits above the SVG */}
      <WebGLSpiral active={entered && view === "spiral"} />
      <ListView active={entered && view === "list"} />

      {entered && (
        <>
          <Logo />
          <ViewToggle mode={view} onChange={setView} />
          <MenuButton open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
          <MenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} />
          <ShowreelLabel />
          <SoundToggle muted={muted} onToggle={() => setMuted((v) => !v)} />
        </>
      )}

      {!entered && (
        <SoundGate
          onEnter={(withSound) => {
            setMuted(!withSound);
            setEntered(true);
          }}
        />
      )}
    </main>
  );
}
