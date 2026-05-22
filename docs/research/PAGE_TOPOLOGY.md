# Page Topology — pacomepertant.com

## Architecture
- **Framework:** Nuxt 3 (Vue), Sanity CMS for project data, Mux for videos, Lottie for icon animations
- **Rendering:** Fullscreen fixed layout — no scroll. `<canvas class="webgl">` (Three.js) renders the spiral of project cards as a 3D scene; HTML overlay (`.home-overlay-wrapper`) contains all UI chrome.
- **Background grid:** A fixed `<svg>` at z-index 0 paints a faint dark grid behind everything.
- **Smooth scroll:** `html.lenis` class — Lenis is loaded but page is non-scrolling so it's effectively a no-op on home; relevant for project pages.

## Routes
- `/` — Home (sound gate → spiral/list view)
- `/projects/<slug>` — Project detail (zoomed WebGL view with close X)
- `/about`, `mailto:` — From menu

## Views (modes) shown on `/`
1. **Sound gate** (initial) — full-black screen, centered green 3D smiley orb (WebGL), "motion & sound designer / based in paris" + "enter with sound •" white pill button + "enter without sound" small text below
2. **Spiral** (default after entering) — floating project cards in a 3D scene (Three.js)
3. **List** — same UI chrome, but center renders a tall stacked list of project names (60px, white, weight 500, letter-spacing -0.72px)

## UI chrome (overlay, fixed positions @ 1440x900)
- **Top-left:** Lottie smiley logo (64x64) at top:30 left:30; on hover reveals a "logo tag wrapper" beside it
- **Top-center:** "spiral • list" tab toggle at top:45 left:720 (width 168, height 18)
- **Top-right:** "menu •" pill button (86x48) at top:30 right:30
- **Bottom-left:** Rotated/circular "showreel ● 2025 ●" text label around a small yellow thumbnail of the reel
- **Bottom-right:** Sound toggle icon (48x48) at top:647 right:30

## Menu panel (when open)
- White pill (rounded 16px) sliding in from right: 465x665, top:30 right:30, bg `#FAFAFA`
- Big black links: works (80px), about (80px), contact (80px), weight 500, letter-spacing -4px
- Below: email `pertantpacome@gmail.com`
- Below: 4 social icons (Instagram, X, Behance, LinkedIn)
- Close X button top-right of panel

## Colors
- Background: `#0A0A0A` (rgb(10,10,10))
- Foreground text: `#FAFAFA` (rgb(250,250,250))
- Menu panel: white `#FAFAFA` with black text `#0A0A0A`

## Typography
- **Family:** "Indivisible Variable" (Adobe Typekit `cxl5sdt`), fallback Helvetica Neue, Arial
- **Weights used:** 400, 500
- **Sizes seen:**
  - 80px (menu nav, weight 500, letter-spacing -4px, line-height 80px)
  - 60px (list items, weight 500, letter-spacing -0.72px, line-height 60px)
  - 24px (hero subtitle on intro)
  - 18px (default body, button text, tab toggles)

## Projects (from Sanity CMS)
10 projects with thumbnail URLs (cdn.sanity.io). Saved to `docs/research/projects.json`.
