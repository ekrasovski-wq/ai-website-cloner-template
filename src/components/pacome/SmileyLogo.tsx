"use client";

/**
 * Animated green orb mark with eyes + smile, matching the lottie used on
 * pacomepertant.com. Pure CSS/SVG so it renders without a lottie dependency.
 */
interface SmileyLogoProps {
  size?: number;
  spin?: boolean;
  className?: string;
}

export function SmileyLogo({ size = 75, spin = true, className }: SmileyLogoProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      <div
        className="smiley-orb"
        style={{
          width: "100%",
          height: "100%",
          animation: spin
            ? "orb-rotate 14s linear infinite, orb-pulse 4.2s ease-in-out infinite"
            : "orb-pulse 4.2s ease-in-out infinite",
        }}
      >
        {/* counter-rotated face so eyes & smile stay upright */}
        <div
          className="smiley-face"
          style={{
            animation: spin ? "orb-rotate 14s linear infinite reverse" : undefined,
          }}
        >
          <svg
            viewBox="0 0 75 75"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            {/* eyes */}
            <circle cx="29" cy="32" r="2.2" fill="#FAFAFA" opacity="0.95" />
            <circle cx="46" cy="32" r="2.2" fill="#FAFAFA" opacity="0.95" />
            {/* highlight on each eye */}
            <circle cx="29.4" cy="31.4" r="0.7" fill="#fff" />
            <circle cx="46.4" cy="31.4" r="0.7" fill="#fff" />
            {/* smile */}
            <path
              d="M27 44 Q37.5 51 48 44"
              stroke="#FAFAFA"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
