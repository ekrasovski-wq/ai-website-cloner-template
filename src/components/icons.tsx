import type { SVGProps } from "react";

export function SmileyOrbIcon({ className }: { className?: string }) {
  // Static decorative orb used as the brand mark.
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <radialGradient id="smiley-grad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#a7f5b1" />
          <stop offset="35%" stopColor="#1fb95c" />
          <stop offset="75%" stopColor="#0a3a1f" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <radialGradient id="smiley-shine" cx="35%" cy="25%" r="22%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#smiley-grad)" />
      <circle cx="32" cy="32" r="30" fill="url(#smiley-shine)" />
      {/* Eyes */}
      <circle cx="24" cy="27" r="2.4" fill="#FAFAFA" />
      <circle cx="40" cy="27" r="2.4" fill="#FAFAFA" />
      {/* Smile */}
      <path
        d="M22 35 Q32 44 42 35"
        fill="none"
        stroke="#FAFAFA"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MenuDotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 8" className={className} aria-hidden>
      <circle cx="4" cy="4" r="3.5" fill="currentColor" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path
        d="M3 3 L13 13 M13 3 L3 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SoundOnIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 9v6h3l5 4V5L8 9H5z"
        stroke="#FAFAFA"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M16 8c1.5 1.2 2.4 2.5 2.4 4s-.9 2.8-2.4 4" stroke="#FAFAFA" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M19 5c2.5 1.8 3.8 4 3.8 7s-1.3 5.2-3.8 7" stroke="#FAFAFA" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function SoundOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 9v6h3l5 4V5L8 9H5z"
        stroke="#FAFAFA"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M16 9l5 6M21 9l-5 6"
        stroke="#FAFAFA"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2H21.5l-7.49 8.563L23 22h-6.781l-5.314-6.94L4.8 22H1.54l8.014-9.156L1 2h6.918l4.804 6.34L18.244 2zm-1.193 18h1.88L7.04 4H5.018l12.033 16z" />
    </svg>
  );
}

export function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M7.5 6H2.5v12h5.4c2.5 0 4.1-1.3 4.1-3.4 0-1.5-.9-2.5-2.2-2.8 1.1-.4 1.8-1.3 1.8-2.6C11.6 7.2 10.1 6 7.5 6zm-2.5 2h2.4c1.1 0 1.7.5 1.7 1.4 0 1-.6 1.5-1.7 1.5H5V8zm0 8v-3.1h2.7c1.3 0 2 .5 2 1.5s-.7 1.6-2 1.6H5zm12.5-5.6c-2.4 0-4 1.7-4 4.1 0 2.5 1.6 4.1 4.1 4.1 1.9 0 3.3-.9 3.8-2.4l-2-.4c-.2.6-.8 1-1.7 1-1.1 0-1.7-.6-1.9-1.8H22c.3-2.9-1.4-4.6-4.5-4.6zm-1.7 3.4c.2-1 .8-1.6 1.8-1.6 1 0 1.6.6 1.7 1.6h-3.5zM14.5 7h5v1.4h-5V7z" />
    </svg>
  );
}

export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.32 0h4.37v1.93h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.43h-4.56v-6.58c0-1.57-.03-3.59-2.19-3.59-2.19 0-2.52 1.71-2.52 3.48V22H7.54V8z" />
    </svg>
  );
}
