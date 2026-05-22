"use client";

import { useEffect, useState } from "react";
import { SmileyLogo } from "./SmileyLogo";

interface SoundGateProps {
  onEnter: (withSound: boolean) => void;
}

const ENTER_LABEL = "enter with sound";

export function SoundGate({ onEnter }: SoundGateProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col items-center justify-center">
      <div
        className={`flex flex-col items-center transition-all duration-700 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <SmileyLogo size={140} spin />

        <p className="mt-[44px] text-[22px] leading-[1.2] font-medium text-center text-[#FAFAFA]">
          <span className="block">motion &amp; sound designer</span>
          <span className="block">based in paris</span>
        </p>

        <button
          type="button"
          onClick={(e) => {
            // stop the click from bubbling to global listeners (avoids any
            // residual interactions with the canvas behind this overlay)
            e.stopPropagation();
            onEnter(true);
          }}
          className="enter-pill mt-[40px] h-[48px] px-[26px] text-[18px]"
          aria-label={ENTER_LABEL}
        >
          <span className="enter-pill__stack" aria-hidden>
            <span className="enter-pill__row">{ENTER_LABEL}</span>
            <span className="enter-pill__row">{ENTER_LABEL}</span>
          </span>
          <span className="sr-only">{ENTER_LABEL}</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEnter(false);
          }}
          className="mt-[18px] text-[14px] text-[#888] hover:text-[#FAFAFA] transition-colors"
        >
          enter without sound
        </button>
      </div>
    </div>
  );
}
