"use client";
// Adapted from reactbits "3d-folder". A folder that fans out preview cards on
// hover; clicking a card opens a lightbox gallery. Used on /works as category
// folders (Logos, Banners, Branding, ...). Theme-toggle / demo App stripped.

import React, {
  useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef,
} from "react";
import { X, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FolderProject {
  id: string;
  image: string;
  title: string;
  video?: string; // optional video; plays in the lightbox (image is the poster)
}

const PLACEHOLDER_IMAGE =
  "https://picsum.photos/seed/folderph/1200/800";

interface ProjectCardProps {
  image: string;
  title: string;
  delay: number;
  isVisible: boolean;
  index: number;
  totalCount: number;
  onClick: () => void;
  isSelected: boolean;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ image, title, delay, isVisible, index, totalCount, onClick, isSelected }, ref) => {
    const middleIndex = (totalCount - 1) / 2;
    const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;
    const rotation = factor * 25;
    const translationX = factor * 85;
    const translationY = Math.abs(factor) * 12;

    return (
      <div
        ref={ref}
        className={cn("absolute w-20 h-28 cursor-pointer group/card", isSelected && "opacity-0")}
        style={{
          transform: isVisible
            ? `translateY(calc(-100px + ${translationY}px)) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.4)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          zIndex: 10 + index,
          left: "-40px",
          top: "-56px",
        }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <div className={cn(
          "w-full h-full rounded-lg overflow-hidden shadow-xl bg-neutral-900 border border-white/5 relative",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "group-hover/card:-translate-y-6 group-hover/card:shadow-2xl group-hover/card:ring-2 group-hover/card:ring-white group-hover/card:scale-125",
        )}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image || PLACEHOLDER_IMAGE} alt={title} className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-black uppercase tracking-tighter text-white truncate drop-shadow-md">{title}</p>
        </div>
      </div>
    );
  },
);
ProjectCard.displayName = "ProjectCard";

interface ImageLightboxProps {
  projects: FolderProject[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  sourceRect: DOMRect | null;
  onCloseComplete?: () => void;
  onNavigate: (index: number) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  projects, currentIndex, isOpen, onClose, sourceRect, onCloseComplete, onNavigate,
}) => {
  const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial");
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [isSliding, setIsSliding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalProjects = projects.length;
  const hasNext = internalIndex < totalProjects - 1;
  const hasPrev = internalIndex > 0;
  const currentProject = projects[internalIndex];

  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex && !isSliding) {
      setIsSliding(true);
      const t = setTimeout(() => { setInternalIndex(currentIndex); setIsSliding(false); }, 400);
      return () => clearTimeout(t);
    }
  }, [currentIndex, isOpen, internalIndex, isSliding]);

  useEffect(() => {
    if (isOpen) { setInternalIndex(currentIndex); setIsSliding(false); }
  }, [isOpen, currentIndex]);

  const navigateNext = useCallback(() => {
    if (internalIndex >= totalProjects - 1 || isSliding) return;
    onNavigate(internalIndex + 1);
  }, [internalIndex, totalProjects, isSliding, onNavigate]);

  const navigatePrev = useCallback(() => {
    if (internalIndex <= 0 || isSliding) return;
    onNavigate(internalIndex - 1);
  }, [internalIndex, isSliding, onNavigate]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    onClose();
    setTimeout(() => {
      setIsClosing(false); setShouldRender(false); setAnimationPhase("initial"); onCloseComplete?.();
    }, 500);
  }, [onClose, onCloseComplete]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") navigateNext();
      if (e.key === "ArrowLeft") navigatePrev();
    };
    window.addEventListener("keydown", onKey);
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [isOpen, handleClose, navigateNext, navigatePrev]);

  useLayoutEffect(() => {
    if (isOpen && sourceRect) {
      setShouldRender(true); setAnimationPhase("initial"); setIsClosing(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimationPhase("animating")));
      const t = setTimeout(() => setAnimationPhase("complete"), 700);
      return () => clearTimeout(t);
    }
  }, [isOpen, sourceRect]);

  if (!shouldRender || !currentProject) return null;

  const getInitialStyles = (): React.CSSProperties => {
    if (!sourceRect) return {};
    const vw = window.innerWidth, vh = window.innerHeight;
    const tw = Math.min(800, vw - 64), th = Math.min(vh * 0.85, 600);
    const tx = (vw - tw) / 2, ty = (vh - th) / 2;
    const scale = Math.max(sourceRect.width / tw, sourceRect.height / th);
    const translateX = sourceRect.left + sourceRect.width / 2 - (tx + tw / 2) + window.scrollX;
    const translateY = sourceRect.top + sourceRect.height / 2 - (ty + th / 2) + window.scrollY;
    return { transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`, opacity: 0.5, borderRadius: "12px" };
  };
  const getFinalStyles = (): React.CSSProperties => ({ transform: "translate(0,0) scale(1)", opacity: 1, borderRadius: "24px" });
  const currentStyles = animationPhase === "initial" && !isClosing ? getInitialStyles() : getFinalStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" onClick={handleClose}
      style={{ opacity: isClosing ? 0 : 1, transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-2xl"
        style={{ opacity: animationPhase === "initial" && !isClosing ? 0 : 1, transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1)" }} />
      <button onClick={(e) => { e.stopPropagation(); handleClose(); }}
        className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20 transition-all duration-300"
        style={{ opacity: animationPhase === "complete" && !isClosing ? 1 : 0, transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(-30px)", transition: "opacity 400ms ease-out 400ms, transform 500ms cubic-bezier(0.16,1,0.3,1) 400ms" }}>
        <X className="w-5 h-5" strokeWidth={2.5} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); navigatePrev(); }} disabled={!hasPrev || isSliding}
        className="absolute left-4 md:left-10 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
        style={{ opacity: animationPhase === "complete" && !isClosing && hasPrev ? 1 : 0, transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(-40px)", transition: "opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16,1,0.3,1) 600ms" }}>
        <ChevronLeft className="w-6 h-6" strokeWidth={3} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); navigateNext(); }} disabled={!hasNext || isSliding}
        className="absolute right-4 md:right-10 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
        style={{ opacity: animationPhase === "complete" && !isClosing && hasNext ? 1 : 0, transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(40px)", transition: "opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16,1,0.3,1) 600ms" }}>
        <ChevronRight className="w-6 h-6" strokeWidth={3} />
      </button>
      <div ref={containerRef} className="relative z-10 w-full max-w-4xl" onClick={(e) => e.stopPropagation()}
        style={{ ...currentStyles, transform: isClosing ? "translate(0,0) scale(0.92)" : currentStyles.transform, transition: animationPhase === "initial" && !isClosing ? "none" : "transform 700ms cubic-bezier(0.16,1,0.3,1), opacity 600ms ease-out, border-radius 700ms ease", transformOrigin: "center center" }}>
        <div className="relative overflow-hidden rounded-[inherit] bg-neutral-900 border border-white/10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="relative overflow-hidden aspect-[4/3] md:aspect-[16/10] bg-neutral-950">
            <div className="flex w-full h-full"
              style={{ transform: `translateX(-${internalIndex * 100}%)`, transition: isSliding ? "transform 500ms cubic-bezier(0.16,1,0.3,1)" : "none" }}>
              {projects.map((project, idx) => (
                <div key={project.id} className="min-w-full h-full relative flex items-center justify-center">
                  {/* object-contain so the whole asset is visible (posts/videos
                      are square/portrait and would otherwise be cropped). */}
                  {project.video ? (
                    <video
                      src={project.video}
                      poster={project.image || undefined}
                      className="max-w-full max-h-full w-auto h-auto object-contain select-none"
                      controls
                      loop
                      muted
                      playsInline
                      autoPlay={idx === internalIndex}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.image || PLACEHOLDER_IMAGE} alt={project.title} className="max-w-full max-h-full w-auto h-auto object-contain select-none"
                      onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="px-8 py-7 bg-neutral-900 border-t border-white/5"
            style={{ opacity: animationPhase === "complete" && !isClosing ? 1 : 0, transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(40px)", transition: "opacity 500ms ease-out 500ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 500ms" }}>
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-white tracking-tight truncate">{currentProject?.title}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full border border-white/5">
                    {projects.map((_, idx) => (
                      <button key={idx} onClick={() => { if (!isSliding && idx !== internalIndex) onNavigate(idx); }}
                        className={cn("w-1.5 h-1.5 rounded-full transition-all duration-500", idx === internalIndex ? "bg-white scale-150" : "bg-white/30 hover:bg-white/60")} />
                    ))}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">{internalIndex + 1} / {totalProjects}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AnimatedFolderProps {
  title: string;
  subtitle?: string;
  projects: FolderProject[];
  className?: string;
  gradient?: string;
  icon?: React.ReactNode;   // small white icon shown before the title
}

export const AnimatedFolder: React.FC<AnimatedFolderProps> = ({ title, subtitle, projects, className, gradient, icon }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const previewProjects = projects.slice(0, 4);

  const handleProjectClick = (project: FolderProject, index: number) => {
    const el = cardRefs.current[index];
    if (el) setSourceRect(el.getBoundingClientRect());
    setSelectedIndex(index);
    setHiddenCardId(project.id);
  };
  const handleCloseLightbox = () => { setSelectedIndex(null); setSourceRect(null); };
  const handleCloseComplete = () => { setHiddenCardId(null); };
  const handleNavigate = (i: number) => { setSelectedIndex(i); setHiddenCardId(projects[i]?.id || null); };

  // Card background gradient (the whole tile). Falls back to a warm orange
  // like the reference if no gradient prop is given.
  const cardBg = gradient || "linear-gradient(160deg, #e8633a 0%, #c94e2c 100%)";
  // The front "pocket" — a lighter, glassy overlay covering the lower half.
  const pocketBg = "linear-gradient(160deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.12) 100%)";

  return (
    <>
      <div
        className={cn("group relative cursor-pointer rounded-[26px] overflow-hidden select-none", className)}
        style={{
          aspectRatio: "1 / 1",
          minWidth: "240px",
          background: cardBg,
          perspective: "1000px",
          boxShadow: isHovered
            ? "0 24px 60px -12px rgba(0,0,0,0.55)"
            : "0 12px 32px -8px rgba(0,0,0,0.4)",
          transform: isHovered ? "translateY(-6px)" : "translateY(0)",
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Sheets of paper peeking out of the pocket */}
        <div className="absolute inset-x-0 top-0 flex justify-center" style={{ height: "62%", perspective: "900px" }}>
          {previewProjects.map((project, index) => {
            const total = previewProjects.length;
            const mid = (total - 1) / 2;
            const f = total > 1 ? (index - mid) / mid : 0;
            const rot = f * 14;                       // fan rotation
            const tx = f * (isHovered ? 46 : 30);     // spread wider on hover
            const ty = isHovered ? -18 - Math.abs(f) * 6 : 26;  // lift up on hover
            return (
              <div
                key={project.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="absolute cursor-pointer"
                onClick={(e) => { e.stopPropagation(); handleProjectClick(project, index); }}
                style={{
                  width: "44%",
                  aspectRatio: "3 / 4",
                  top: "16%",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                  transform: `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg)`,
                  opacity: hiddenCardId === project.id ? 0 : 1,
                  transition: `transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 40}ms, opacity 0.3s ease`,
                  zIndex: 10 + index,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.image} alt={project.title} className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }} />
              </div>
            );
          })}
        </div>

        {/* Front glassy pocket covering the lower portion */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "52%",
            background: pocketBg,
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
            zIndex: 30,
          }}
        />
        {/* Subtle top sheen */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(circle at 30% 0%, rgba(255,255,255,0.25) 0%, transparent 55%)",
          zIndex: 31,
        }} />

        {/* Label + gear icon */}
        <div className="absolute left-5 bottom-5 right-5 z-40 flex items-end justify-between">
          <div>
            <h3
              className="text-white font-bold leading-tight flex items-center gap-2"
              style={{ fontFamily: 'Indivisible, "Helvetica Neue", Arial, sans-serif', fontSize: "26px" }}
            >
              {icon && <span className="inline-flex items-center text-white shrink-0">{icon}</span>}
              <span>{title}</span>
            </h3>
            {subtitle && (
              <p className="text-white/80 text-[13px] mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
        </div>
      </div>

      <ImageLightbox projects={projects} currentIndex={selectedIndex ?? 0} isOpen={selectedIndex !== null} onClose={handleCloseLightbox} sourceRect={sourceRect} onCloseComplete={handleCloseComplete} onNavigate={handleNavigate} />
    </>
  );
};
