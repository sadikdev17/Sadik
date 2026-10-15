# TASTE.md — Design rules for sadiqur.dev

The combination, borrowed from 4 reference sites:

- **threeui.com** → the 3D layer. Full-screen interactive Three.js hero (warp-field
  particles + wireframe geometry, mouse-reactive). 3D is the stage, not decoration.
- **gsap.com** → the motion engine. ScrollTrigger scrub/pin, SplitText headline
  reveals, horizontal-scroll work reel, magnetic buttons. Dark + electric green,
  developer-craft credibility.
- **21st.dev** → the component vocabulary. Glassy scroll-aware nav, shader-grade
  ambient backgrounds, project cards with shine-sweep hovers, oversized display type.
- **tasteskill.dev** → the discipline. Written taste rules (this file), no generic
  patterns, editorial numbered sections, tabbed journey timeline, mandatory
  reduced-motion support.

## Palette

- `--bg: #060606` — near black. `--panel: #0c0c0c`
- `--ink: #f4f1e8` — warm cream text (never pure white)
- `--neon: #39ff14` — the one accent. Used sparingly: eyebrows, active states,
  key words, the 3D wireframe. If everything glows, nothing glows.
- `--muted: #8a877f` — secondary text

## Type

- Display: **Anton** — huge, uppercase, tight. Headlines only.
- Body: **Space Grotesk**. Labels/eyebrows: **JetBrains Mono**, uppercase, tracked.

## Motion rules

1. Every animation is GSAP-driven. No raw scroll listeners for animation.
2. Headlines reveal per-character (SplitText), never whole-block fades alone.
3. Scroll scrubs the hero; the work reel pins and pans horizontally (desktop).
4. Buttons are magnetic; cards get shine sweeps. Nothing bounces — use expo/power eases.
5. `prefers-reduced-motion` → static hero frame, no pin, no marquee, instant reveals.
6. Preloader is fast (<1.2s): counter + curtain, never a spinner that overstays.

## Forbidden

- Generic skill bars, lorem ipsum, stock "creative developer" clichés.
- Pure-white text on pure black. No gradients-for-gradient's-sake.
- More than one neon element glowing per viewport.
- Autoplay video with sound. Ever.
