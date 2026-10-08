"use client";
// Dark is the site's main theme; this lets a visitor opt into light mode.
// The choice persists in localStorage and is applied as data-theme on <html>
// (an inline script in layout.tsx applies it before paint to avoid a flash).

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { play } from "@/lib/sounds";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    let saved: "dark" | "light" = "dark";
    try {
      if (localStorage.getItem("theme") === "light") saved = "light";
    } catch {}
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
    play("switch");
  };

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => play("hover")}
      aria-label={theme === "dark" ? "switch to light mode" : "switch to dark mode"}
      className="fixed right-[30px] bottom-[86px] z-20 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
    >
      {theme === "dark" ? <Sun className="w-5 h-5" strokeWidth={2} /> : <Moon className="w-5 h-5" strokeWidth={2} />}
    </button>
  );
}
