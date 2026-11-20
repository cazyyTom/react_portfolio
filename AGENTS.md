# Project: Devesh Tanwar portfolio, 3D redesign

## Goal
Redesign the existing portfolio (plain HTML/CSS/JS) into an immersive, scroll-driven 3D site. Design and motion change; content does not.

## Hard rules
1. CONTENT IS FROZEN. All text, projects, links, skills, experience, email and social links from the current site must be carried over verbatim. Never invent content, metrics, testimonials or client names. If something is missing, leave it out and report it.
2. Stack: Vite + vanilla ES modules + Three.js + GSAP (ScrollTrigger) + Lenis. No React, no Angular, no CSS framework. Plain CSS with custom properties.
3. One fixed WebGL canvas behind the DOM, driven by scroll. All text stays in the DOM (accessible, SEO-friendly).
4. Preserve existing meta tags, og.png, favicon, canonical URL, analytics, CNAME and deploy config.
5. Performance: 60fps on a mid-range laptop, under 3 MB initial JS+assets, GLB compressed (Draco/meshopt), pixel ratio capped at 2, lazy-load heavy assets.
6. Support prefers-reduced-motion and provide a no-WebGL fallback.
7. Mobile-first. Simplify or disable heavy effects on touch devices.

## Visual language
Black sections alternating with a light rounded panel sliding over dark. Huge chunky display font for headings, clean grotesk for body. Gradient (pink > purple > blue) pill buttons. Thin outlined rounded cards. Bold numbered lists with thin dividers. Glossy floating 3D objects, marquee rows, stacked sticky cards, parallax.

## Section order
Hero, About, Skills marquee, Projects, Work Experience, 3D Footer (with existing contact info and form).

## Working agreements
- Do not ask clarifying questions. Make reasonable assumptions, proceed, and list assumptions at the end.
- Keep changes scoped to the task. Do not refactor unrelated files.
- Before finishing any task, run `npm run build` (and lint if configured) and fix all errors.
- Commit after each task with a clear message.
- Final reply format: Summary, Files changed, Assumptions, Anything needing my manual input.
