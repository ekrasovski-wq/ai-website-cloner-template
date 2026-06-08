"use client";
// Adapted from reactbits SplitText (GSAP). Animates text in by splitting into
// chars / words / lines and tweening them with stagger.

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";
  onLetterAnimationComplete?: () => void;
}

// Lightweight split: by chars or words. Wraps each unit in a span so we can
// animate them individually. The official SplitText GSAP plugin is a paid
// Club GreenSock plugin; this hand-rolled split is enough for our case.
function splitToSpans(text: string, mode: "chars" | "words"): HTMLSpanElement[] {
  return []; // populated at runtime below — function kept for typing reference
}

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "0px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const completeRef = useRef(onLetterAnimationComplete);
  useEffect(() => { completeRef.current = onLetterAnimationComplete; }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, []);

  useGSAP(() => {
    if (!ref.current || !text || !fontsLoaded) return;
    const el = ref.current;
    el.innerHTML = "";

    // Split text into spans
    const units: HTMLSpanElement[] = [];
    const tokens = splitType === "words" ? text.split(" ") : Array.from(text);
    tokens.forEach((tok, i) => {
      const span = document.createElement("span");
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity, filter";
      // preserve spaces
      if (tok === " ") {
        span.innerHTML = " ";
      } else {
        span.textContent = tok;
      }
      el.appendChild(span);
      if (splitType === "words" && i < tokens.length - 1) {
        const sp = document.createElement("span");
        sp.innerHTML = " ";
        sp.style.display = "inline-block";
        el.appendChild(sp);
      }
      units.push(span);
    });

    const startPct = (1 - threshold) * 100;
    const tween = gsap.fromTo(
      units,
      from as gsap.TweenVars,
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: el,
          start: `top ${startPct}%`,
          once: true,
          fastScrollEnd: true,
        },
        onComplete: () => completeRef.current?.(),
        force3D: true,
      } as gsap.TweenVars,
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
      tween.kill();
    };
  }, { dependencies: [text, delay, duration, ease, splitType, threshold, rootMargin, fontsLoaded, JSON.stringify(from), JSON.stringify(to)], scope: ref as React.RefObject<HTMLElement> });

  const style: React.CSSProperties = {
    textAlign,
    overflow: "hidden",
    display: "inline-block",
    whiteSpace: "normal",
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };
  const Tag = tag as keyof React.JSX.IntrinsicElements;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Tag ref={ref as any} style={style} className={className}>{text}</Tag>;
}
