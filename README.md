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


