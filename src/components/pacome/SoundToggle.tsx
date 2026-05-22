"use client";

interface SoundToggleProps {
  muted: boolean;
  onToggle: () => void;
}

/**
 * Bottom-right circular sound toggle, matching the SVG icons used on the
 * original site (waves on the right of a speaker for "on" / strike-through for
 * "off").
 */
export function SoundToggle({ muted, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? "Unmute" : "Mute"}
      className="fixed bottom-[26px] right-[26px] z-30 w-[44px] h-[44px] rounded-full bg-[#FAFAFA] text-[#0A0A0A] flex items-center justify-center hover:scale-[1.05] active:scale-[0.95] transition-transform"
    >
      <svg
        width="14"
        height="12"
        viewBox="0 0 14 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g clipPath="url(#sound-clip)">
          <path
            d="M2.66667 8.00014H1.33334C1.15653 8.00014 0.986958 7.92991 0.861934 7.80488C0.73691 7.67986 0.666672 7.51029 0.666672 7.33348V4.66681C0.666672 4.49 0.73691 4.32043 0.861934 4.19541C0.986958 4.07038 1.15653 4.00014 1.33334 4.00014H2.66667L5.00001 1.00014C5.05827 0.886965 5.1551 0.79836 5.273 0.750339C5.39089 0.702319 5.52207 0.698051 5.64284 0.738307C5.76361 0.778562 5.86599 0.860685 5.93149 0.969838C5.997 1.07899 6.0213 1.20797 6.00001 1.33348V10.6668C6.0213 10.7923 5.997 10.9213 5.93149 11.0305C5.86599 11.1396 5.76361 11.2217 5.64284 11.262C5.52207 11.3022 5.39089 11.298 5.273 11.2499C5.1551 11.2019 5.05827 11.1133 5.00001 11.0001L2.66667 8.00014Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {muted ? (
            <>
              <path
                d="M9 4 L13 8"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
              />
              <path
                d="M13 4 L9 8"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <path
                d="M8.66678 3.3335C9.08077 3.64399 9.41678 4.0466 9.6482 4.50945C9.87963 4.9723 10.0001 5.48268 10.0001 6.00016C10.0001 6.51765 9.87963 7.02802 9.6482 7.49087C9.41678 7.95373 9.08077 8.35634 8.66678 8.66683"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 1C11.621 1.58217 12.125 2.33707 12.4721 3.20492C12.8193 4.07276 13 5.02972 13 6C13 6.97028 12.8193 7.92724 12.4721 8.79508C12.125 9.66293 11.621 10.4178 11 11"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </g>
        <defs>
          <clipPath id="sound-clip">
            <rect width="14" height="12" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}
