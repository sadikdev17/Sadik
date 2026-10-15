# Sadiqur — Personal Portfolio

Premium dark 3D personal portfolio for **MD Sadiqur Islam** — WordPress Developer & SEO Specialist, Dhaka, Bangladesh.

## Stack

- Static HTML/CSS/JS — no build step, deploys anywhere
- [Three.js](https://threejs.org/) — interactive warp-field hero scene
- [GSAP + ScrollTrigger](https://gsap.com/) — scroll-driven motion

## Structure

```
index.html          — all sections
css/style.css       — design system
js/scene.js         — Three.js hero (particles + wireframe geometry)
js/main.js          — GSAP motion layer
assets/             — portrait + project images
TASTE.md            — design rules borrowed from tasteskill.dev
```

## Develop

Serve the folder with any static server, e.g. `python3 -m http.server`, then open the URL.

## Deploy

Push to `main` — Vercel auto-deploys from this repo.
