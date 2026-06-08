# Behaviors — pacomepertant.com

## Sound mapping (Howler.js, files in /public/sounds/)
| File | Triggered by |
|---|---|
| `ambient.ogg` | Background loop after "enter with sound" click |
| `smiley/smiley1..4.ogg` | Random pick when hovering or clicking the 3D logo (rotates the face) |
| `hover.ogg` | Generic hover on most clickable UI elements |
| `click.ogg` | Generic click |
| `longclick.ogg` | Mouse held > ~200ms |
| `switch.ogg` | Toggling spiral↔list |
| `spiral.ogg` | When spiral view becomes active |
| `list.ogg` | When list view becomes active |
| `tick.ogg` | Small UI ticks (e.g. dot in switch indicator) |
| `close.ogg` | Closing menu panel |
| `menu/homelink.ogg` | Hovering "works" link in menu |
| `menu/aboutlink.ogg` | Hovering "about" link in menu |

## Animations
- **EntryOverlay → home crossfade**: opacity 0.5s ease-out; on click `enter with sound`, overlay fades out and ambient sound starts.
- **Logo hover**: scale spring + tooltip "spiral / motion / 2025" appears (GSAP timeline, `--ease-spring`).
- **3D carousel (spiral)**: cards float in a tilted-grid 3D layout, slowly orbit camera, hovered card scales up and rises; sticker label "ProjectName" appears on top-left at slight rotation.
- **List mode**: 9 names stacked vertically center, font 60px. Hovered = white #fff (1.0 opacity), un-hovered = rgba(255,255,255,0.3).
- **Switch toggle**: dot moves between "spiral" and "list"; plays `switch.ogg` + view-specific sound. Animated with GSAP.
- **Menu button → MenuPanel**: panel slides in from right (translateX 100% → 0), 0.5s `ease-spring`. Close button fades in. Closes with same animation reversed + `close.ogg`.
- **Marquee**: infinite horizontal scroll, rotated -22deg or so, gradient mask on edges.
- **About**: text fades in word-by-word on load.

## Lenis smooth scroll
Active on `<html>`, with default config: `lerp: 0.1, smoothWheel: true`.
