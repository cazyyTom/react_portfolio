import { useEffect, useLayoutEffect, useRef, useState } from "react";

const SKILL_MARQUEE_MOTION = {
  baselineSpeed: 30, // pixels per second, left to right
  maximumSpeed: 235, // pixels per second
  deceleration: 1.9, // exponential decay rate per second; higher settles sooner
};

const icons = {
  React: "/skill-icons.svg#react",
  "Tailwind CSS": "/skill-icons.svg#tailwind",
  Git: "/skill-icons.svg#git",
  Vercel: "/skill-icons.svg#vercel",
  "GitHub API/Webhooks": "/icons.svg#github-icon",
};

export default function SkillMarquee({ groups }) {
  const viewport = useRef(null);
  const track = useRef(null);
  const sequence = useRef(null);
  const offset = useRef(0);
  const [copies, setCopies] = useState(2);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const row = track.current;
    let distance = 0;
    const paint = () => {
      row.style.transform = `translate3d(${offset.current - distance}px, 0, 0)`;
    };
    const measure = () => {
      // The sequence's trailing padding is exactly one inter-card gap.
      distance = sequence.current.getBoundingClientRect().width;
      if (!distance) return;
      offset.current %= distance;
      setCopies(Math.ceil(viewport.current.clientWidth / distance) + 1);
      paint();
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(sequence.current);
    resize.observe(viewport.current);

    const { baselineSpeed, maximumSpeed, deceleration } = SKILL_MARQUEE_MOTION;
    let speed = baselineSpeed;
    let previousTime = null;
    let previousY = window.scrollY;
    let frame = 0;
    let nearby = false;
    function advance(time) {
      if (previousTime !== null && time > previousTime && distance) {
        const dt = (time - previousTime) / 1000;
        const velocity = Math.abs(window.scrollY - previousY) / dt;
        const target = Math.min(maximumSpeed, baselineSpeed + velocity * .2);
        const rate = target > speed ? 9 : deceleration;
        const decay = Math.exp(-rate * dt);
        // Integrate the eased velocity over this frame, including fractional pixels.
        offset.current = (offset.current + target * dt + (speed - target) * (1 - decay) / rate) % distance;
        speed = target + (speed - target) * decay;
        paint();
      }
      previousTime = time;
      previousY = window.scrollY;
      frame = requestAnimationFrame(advance);
    }
    function syncPlayback() {
      cancelAnimationFrame(frame);
      previousTime = null;
      speed = baselineSpeed;
      if (!paused && nearby && !document.hidden) frame = requestAnimationFrame(advance);
    }
    const visibility = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      syncPlayback();
    }, { rootMargin: "50% 0px" });
    visibility.observe(viewport.current);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      resize.disconnect();
      visibility.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", syncPlayback);
      row.style.removeProperty("transform");
    };
  }, [paused, reducedMotion]);

  return (
    <div className="skills">
      <div className="skills__header">
        <h3 id="skills-heading">Tech stack</h3>
        {!reducedMotion && (
          <button type="button" className="skills__playback" onClick={() => setPaused(!paused)}
            aria-label={paused ? "Resume skills animation" : "Pause skills animation"}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              {paused ? <path d="m4 2 9 6-9 6z" /> : <path d="M4 2h3v12H4zm5 0h3v12H9z" />}
            </svg>
          </button>
        )}
      </div>
      <div ref={viewport} className="skills__viewport">
        <div ref={track} className="skills__track">
          {Array.from({ length: reducedMotion ? 1 : copies }, (_, index) => (
            <ul className="skills__sequence" key={index} ref={index === 0 ? sequence : null}
              aria-labelledby={index === 0 ? "skills-heading" : undefined} aria-hidden={index > 0 || undefined}>
              {groups.flatMap(({ group, names }) => names.map((name) => (
                <li className="skills__card" key={name}>
                  {icons[name] && <svg aria-hidden="true" className="skills__icon"><use href={icons[name]} /></svg>}
                  <span><small>{group}</small>{name}</span>
                </li>
              )))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
