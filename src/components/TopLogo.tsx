"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Mascot3D } from "./Mascot3D";

export function TopLogo() {
  // Smaller smiley on phones.
  const [size, setSize] = useState(64);
  useEffect(() => {
    const update = () => setSize(window.innerWidth < 640 ? 46 : 64);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <Link
      href="/"
      className="fixed top-4 left-4 sm:top-[24px] sm:left-[24px] z-20 block"
      aria-label="home"
    >
      <Mascot3D size={size} />
    </Link>
  );
}
