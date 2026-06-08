"use client";
// Adapted from reactbits VariableProximity. Letters morph their font-variation
// weight based on cursor proximity. Used for the "menu" pill label.

import { forwardRef, useEffect, useMemo, useRef, MouseEvent, CSSProperties } from "react";
import { motion } from "motion/react";

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId = 0;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useMousePositionRef(containerRef?: React.RefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent | globalThis.MouseEvent) => {
      updatePosition((ev as globalThis.MouseEvent).clientX, (ev as globalThis.MouseEvent).clientY);
    };
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove as EventListener);
    window.addEventListener("touchmove", handleTouchMove as EventListener);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove as EventListener);
      window.removeEventListener("touchmove", handleTouchMove as EventListener);
    };
  }, [containerRef]);

  return positionRef;
}

interface VariableProximityProps {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef?: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: "linear" | "exponential" | "gaussian";
  className?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<HTMLSpanElement>) => void;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>(function VariableProximity(props, ref) {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = "linear",
    className = "",
    onClick,
    style,
  } = props;

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const interpolatedSettingsRef = useRef<string[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map<string, number>(
        settingsStr
          .split(",")
          .map((s) => s.trim())
          .map((s) => {
            const [name, value] = s.split(" ");
            return [name.replace(/['"]/g, ""), parseFloat(value)] as [string, number];
          }),
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  // Lock each letter to the width it has at the *base* weight, centred inside
  // its box. Heavier glyphs then overflow symmetrically instead of pushing
  // their neighbours — this stops both the line-reflow jump and the jitter
  // feedback loop (where a wider glyph moved its own centre every frame).
  useEffect(() => {
    let cancelled = false;
    const lockWidths = () => {
      if (cancelled) return;
      letterRefs.current.forEach((el) => {
        if (!el) return;
        el.style.width = "auto";
        el.style.fontVariationSettings = fromFontVariationSettings;
      });
      // Measure after the reset has been applied.
      letterRefs.current.forEach((el) => {
        if (!el) return;
        const w = el.getBoundingClientRect().width;
        el.style.width = `${w}px`;
        el.style.textAlign = "center";
      });
    };
    lockWidths();
    // Re-measure once webfonts finish loading and whenever the box resizes.
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(lockWidths).catch(() => {});
    }
    window.addEventListener("resize", lockWidths);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", lockWidths);
    };
  }, [label, fromFontVariationSettings]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = (distance: number) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case "exponential": return norm ** 2;
      case "gaussian":    return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case "linear":
      default:            return norm;
    }
  };

  useAnimationFrame(() => {
    if (!containerRef?.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const { x, y } = mousePositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) return;
    lastPositionRef.current = { x, y };

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;
      const rect = letterRef.getBoundingClientRect();
      const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
      const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

      const distance = calculateDistance(
        mousePositionRef.current.x,
        mousePositionRef.current.y,
        letterCenterX,
        letterCenterY,
      );

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(", ");

      interpolatedSettingsRef.current[index] = newSettings;
      letterRef.style.fontVariationSettings = newSettings;
    });
  });

  const words = label.split(" ");
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={className}
      onClick={onClick}
      style={{ display: "inline", ...style }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((letter) => {
            const currentLetterIndex = letterIndex++;
            return (
              <motion.span
                key={currentLetterIndex}
                ref={(el) => { letterRefs.current[currentLetterIndex] = el; }}
                style={{
                  display: "inline-block",
                  fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex],
                }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span style={{ display: "inline-block" }}>&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

export default VariableProximity;
