# Page Topology — pacomepertant.com

## Layers (z-index, bottom → top)
1. **WebGLBackground** (z=0, position:fixed) — full-viewport canvas with 3D logo on landing, 3D project carousel after entry. Black bg.
2. **GridBackground** (very subtle 1px lines, z=1) — visible on about page especially
3. **Marquee** (`showreel ✲ 2025`, z=10) — bottom-left, rotated ~25deg, repeating ticker
4. **Top nav** (z=20):
   - Logo (top-left)
   - Spiral/List switch (top-center, only on Works)
   - Menu button (top-right, "menu •" with pill bg when closed)
5. **Sound toggle** (z=20, bottom-right circular icon)
6. **MenuPanel** (z=30, slides in from right, white background)
7. **EntryOverlay** (z=40, only on first visit) — full-screen black with logo + "enter with sound / without sound"

## Routes
- `/` — Works page (3D project carousel by default + list mode switch)
- `/about` — About page (centered description text on subtle grid bg)
- Contact = `mailto:pertantpacome@gmail.com`

## Interaction Models
- Smooth scroll: **Lenis**
- Sound on every click/hover: **Howler.js** (singleton manager)
- All transitions/animations: **GSAP**
- 3D scenes: **React Three Fiber (Three.js)**
- Project view mode (spiral ↔ list): **click-driven** with crossfade
