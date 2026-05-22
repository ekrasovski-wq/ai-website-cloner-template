"use client";

/**
 * Replicates the SVG background from pacomepertant.com:
 * a 50px grid pattern at low opacity, with a dark blurred elliptical mask
 * removing the center to create a soft vignette.
 */
export function BackgroundPattern() {
  return (
    <svg
      className="bg-pattern-svg"
      width="1920"
      height="1200"
      viewBox="0 0 1920 1200"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g clipPath="url(#clip0_792_154)">
        <rect
          width="1920"
          height="1200"
          fill="url(#pattern0_792_154)"
          fillOpacity="0.2"
        />
        <g filter="url(#filter0_f_792_154)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2442 1526H-522V-326H2442V1526ZM960 14C453.003 14 42 276.585 42 600.5C42 924.415 453.003 1187 960 1187C1467 1187 1878 924.415 1878 600.5C1878 276.585 1467 14 960 14Z"
            fill="#0A0A0A"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_792_154"
          x="-1022"
          y="-826"
          width="3964"
          height="2852"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_792_154" />
        </filter>
        <clipPath id="clip0_792_154">
          <rect width="1920" height="1200" fill="white" />
        </clipPath>
        <pattern
          id="pattern0_792_154"
          patternUnits="userSpaceOnUse"
          patternTransform="matrix(50 0 0 50 934.75 574.75)"
          preserveAspectRatio="none"
          viewBox="-0.5 -0.5 100 100"
          width="1"
          height="1"
        >
          <g id="pattern0_792_154_inner">
            <rect width="100" height="100" stroke="white" />
          </g>
        </pattern>
      </defs>
    </svg>
  );
}
