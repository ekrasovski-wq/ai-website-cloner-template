# Behaviors — pacomepertant.com

## Sound gate (intro)
- On first load, full-black screen with the 3D smiley orb and "enter with sound" / "enter without sound" buttons.
- Clicking either button fades out the gate and reveals the spiral/list view + plays/mutes audio.
- The smiley orb rotates/breathes (it's the WebGL canvas rendering a Three.js sphere with shader).

## Spiral / List toggle
- "spiral" and "list" are sibling buttons with a `•` dot between them.
- Clicking "list" fades out the WebGL cards and renders an HTML stacked list (one entry per project, 60px).
- Clicking "spiral" fades the list back out and resumes the WebGL scene.
- The `active` state moves the dot indicator and changes the inactive item to a lower opacity.

## Spiral motion
- The cards float in a 3D "spiral" — each card is a `THREE.Mesh` with the project thumbnail as its texture, randomly positioned and rotated, animating slowly. Mouse movement causes parallax (camera tilts based on cursor).

## Menu open/close
- Menu button at top-right has text "menu" + a small dot.
- Click → a white pill slides in from the right (translateX). It contains "works / about / contact" links, email, and 4 social icons.
- Close X at top-right of the panel reverses it. Pressing Escape also closes it.

## Logo hover
- Hovering the smiley logo (top-left) reveals a small text label beside it ("logo-tag-wrapper", 80x33 absolute right of it).

## Sound toggle
- Sound icon (bottom-right) toggles audio mute. Icon changes between speaker-with-bars / speaker-with-X.

## Showreel label
- Bottom-left has a small thumbnail card with circular/rotated text "showreel ● 2025 ● showreel ● ..." rotating around it.
- Hover/click likely opens the showreel video.

## Project click
- Clicking a card in spiral or a name in list navigates to `/projects/<slug>` which opens a zoomed WebGL view of that project's thumbnail with a close X (top-right) to return to home.

## Cursor
- Custom cursor — the default arrow is replaced; on hover over interactives it changes (shown by ref_5 having a different cursor in screenshots).

## Scroll
- Home is non-scrolling (page height = viewport height).
- Project detail pages use Lenis smooth scroll.

## Responsive
- Not extensively explored — site is primarily a desktop motion-design portfolio. Mobile would likely stack the UI vertically and replace the WebGL spiral with a swipeable list.
