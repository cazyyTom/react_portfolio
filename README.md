# Devesh — Portfolio (React + Vite)

A fresher-focused developer portfolio built with React + Vite, vanilla CSS (CSS variables for theming), and zero UI libraries.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## What's inside

```
src/
  context/
    ThemeContext.jsx     -> theme state (defaults to dark), persisted to localStorage
  hooks/
    useMagneticHover.js  -> cursor-follow "magnetic" hover effect (buttons, links)
    useRevealOnScroll.js -> IntersectionObserver-based fade/slide-in on scroll
  components/
    Header.jsx / .css    -> sticky nav, logo, theme toggle, CTA, mobile hamburger menu
    Hero.jsx / .css      -> big typographic headline + overlapping photo with gradient fade
    Work.jsx / .css      -> project grid (placeholder cards) -> links out to GitHub
    Projects.jsx / .css  -> project demo grid for screenshots / demo videos
    About.jsx / .css     -> bio, stats, tech-stack list (no percentages), resume download
    Footer.jsx / .css    -> big email CTA, sitemap, socials
    ThemeToggle.jsx/.css -> the light/dark switch component
  index.css              -> CSS custom properties for both themes
  App.jsx                -> composes everything inside <ThemeProvider>
```

## Recent changes (this round)

- Default theme is now **dark** (toggle still switches to light).
- Renamed everything from "Alex" to **Devesh**.
- Removed the photography angle entirely -- positioned as **Full Stack Developer based in IIT Roorkee, India**.
- Replaced the old "Photos" section with a **Project Demos** section (`Projects.jsx`) for screenshots/demo videos of your projects. Each card has a placeholder for either an image or a video -- swap the placeholder `div` for an `<img>` or `<video controls>` tag once you have media.
- Repositioned the whole site around being a **fresher looking for a remote internship** -- hero badge, CTAs, About copy, and footer all reflect this now.
- Skills section now lists your exact stack as plain category rows (no progress bars / no percentages):
  - Frontend: React, Next.js, Tailwind CSS, HTML/CSS
  - Backend: Node.js, Express, REST APIs
  - Databases: PostgreSQL, MongoDB
  - Tools: Git, Vercel, Postman, Docker (basic)
- Hero photo now **overlaps the headline text** like the reference image you sent, using `position: absolute` + a `mask-image` gradient so it fades into the background at the bottom instead of having a hard edge.
- Added thorough responsive breakpoints (1024px / 768px / 480px) across every component -- header, hero, work grid, project demo grid, about, and footer all reflow properly down to small phone widths.

## Adding your photo to the hero

In `Hero.jsx`, find:

```jsx
<div className="hero-image-wrapper">
  <div className="hero-image hero-image--placeholder">
    ...
  </div>
</div>
```

Replace it with:

```jsx
<div className="hero-image-wrapper">
  <img src="/devesh.jpg" alt="Devesh Tanwar" className="hero-image" />
</div>
```

Drop `devesh.jpg` into the `public/` folder so it's served from `/devesh.jpg`. The `.hero-image` class already has the `border-radius` + bottom gradient mask applied, so no extra CSS changes needed.

## Adding project screenshots / demo videos

In `Projects.jsx`, each `demo-card__placeholder` div is a stand-in. Replace it with:

```jsx
{/* for a screenshot */}
<img src="/projects/project-1.png" alt="Project One screenshot" />

{/* for a demo video */}
<video src="/projects/project-2.mp4" controls muted playsInline />
```

Then update `.demo-card__placeholder` in `Projects.css` to target `img`/`video` instead (e.g. `width: 100%; height: 100%; object-fit: cover;`).

## Theming

Everything runs off CSS variables defined in `src/index.css`. `ThemeContext` toggles a `data-theme="dark"` attribute on `<html>` (now defaulting to dark on first load) -- to restyle colors, edit the variables, no component code needs to change.

## Placeholders to replace later

- Hero photo (`.hero-image-wrapper`)
- Work project images (`.project-card__img-placeholder`)
- Project demo screenshots/videos (`.demo-card__placeholder`)
- Email addresses, resume link, social URLs, project descriptions throughout
