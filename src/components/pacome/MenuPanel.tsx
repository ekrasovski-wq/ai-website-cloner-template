"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  CloseIcon,
  InstagramIcon,
  XIcon,
  BehanceIcon,
  LinkedinIcon,
} from "@/components/icons";

interface MenuPanelProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { label: "works", href: "/" },
  { label: "about", href: "/about" },
  { label: "contact", href: "mailto:pertantpacome@gmail.com" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com", Icon: InstagramIcon },
  { label: "X / Twitter", href: "https://www.x.com/pacomepertant", Icon: XIcon },
  { label: "Behance", href: "https://www.behance.net/pacomepertant", Icon: BehanceIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/pac%C3%B4me-pertant-b4437126b/", Icon: LinkedinIcon },
];

export function MenuPanel({ open, onClose }: MenuPanelProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={`fixed top-[20px] right-[20px] bottom-[20px] z-40 w-[465px] max-w-[calc(100vw-40px)] rounded-[20px] bg-[#FAFAFA] text-[#0A0A0A] transition-all ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        open
          ? "opacity-100 translate-x-0 pointer-events-auto duration-[600ms]"
          : "opacity-0 translate-x-[24px] pointer-events-none duration-[400ms]"
      }`}
      style={{
        boxShadow: open
          ? "0 30px 80px rgba(0,0,0,0.55)"
          : "0 0 0 rgba(0,0,0,0)",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-[20px] right-[20px] flex items-center gap-[10px] text-[16px] font-medium leading-none h-[44px] pl-[16px] pr-[8px] rounded-full bg-transparent hover:opacity-70 transition-opacity"
        aria-label="Close menu"
      >
        <span>close</span>
        <span className="w-[28px] h-[28px] rounded-full bg-[#0A0A0A] text-[#FAFAFA] flex items-center justify-center">
          <CloseIcon className="w-[10px] h-[10px]" />
        </span>
      </button>

      <div className="absolute inset-0 px-[40px] pt-[120px] pb-[40px] flex flex-col justify-between">
        <nav className="flex flex-col gap-[6px]">
          {links.map(({ label, href }, i) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className="text-[80px] leading-[0.95] font-medium tracking-[-0.04em] hover:opacity-60 transition-all duration-500"
              style={{
                transitionDelay: `${100 + i * 60}ms`,
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(-12px)",
                transitionProperty: "opacity, transform",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div
          className="flex flex-col gap-[20px] transition-all duration-500"
          style={{
            transitionDelay: open ? "320ms" : "0ms",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <a
            href="mailto:pertantpacome@gmail.com"
            className="text-[16px] font-medium hover:opacity-70 transition-opacity"
          >
            pertantpacome@gmail.com
          </a>
          <div className="flex items-center gap-[10px] text-[#0A0A0A]">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-[42px] h-[42px] rounded-full border border-[#0A0A0A]/15 flex items-center justify-center hover:bg-[#0A0A0A] hover:text-[#FAFAFA] transition-colors"
              >
                <Icon className="w-[16px] h-[16px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
