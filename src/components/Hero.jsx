import { useEffect, useRef } from "react";
import "./Hero.css";

const portrait = "/me.png";

// These four marks correspond to skills in About's Tech stack.
function OrbitalArtwork() {
  return (
    <div className="hero__art">
      <div className="hero__orbit-field" aria-hidden="true">
        <svg className="hero__rings" viewBox="0 0 600 600" fill="none">
          <g stroke="currentColor" strokeWidth=".8">
            <circle cx="300" cy="300" r="122" />
            <circle cx="300" cy="300" r="181" />
            <circle cx="300" cy="300" r="241" />
            <circle cx="300" cy="300" r="298" strokeDasharray="2 6" />
          </g>
          <g fill="currentColor">
            <circle cx="300" cy="119" r="2.6" />
            <circle cx="68" cy="235" r="2.6" />
            <circle cx="528" cy="378" r="2.6" />
          </g>
        </svg>
        <svg className="hero__tech hero__tech--react" viewBox="0 0 46 46">
          <use href="/skill-icons.svg#react" />
        </svg>
        <svg className="hero__tech hero__tech--tailwind" viewBox="0 0 24 24">
          <use href="/skill-icons.svg#tailwind" />
        </svg>
        <svg className="hero__tech hero__tech--git" viewBox="0 0 32 32">
          <use href="/skill-icons.svg#git" />
        </svg>
        <svg className="hero__tech hero__tech--vercel" viewBox="0 0 24 24">
          <use href="/skill-icons.svg#vercel" />
        </svg>
      </div>
      <img className="hero__portrait" src={portrait} alt="Devesh - fullStack developer"
        width="1537" height="1600" fetchPriority="high" draggable="false" />
    </div>
  );
}

export default function Hero() {
  const panelRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    const motion = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const reset = () => {
      panel.style.removeProperty("--pointer-x");
      panel.style.removeProperty("--pointer-y");
    };
    const move = (event) => {
      if (event.pointerType === "touch") return;
      const rect = panel.getBoundingClientRect();
      panel.style.setProperty("--pointer-x", (event.clientX - rect.left) / rect.width * 2 - 1);
      panel.style.setProperty("--pointer-y", (event.clientY - rect.top) / rect.height * 2 - 1);
    };
    const sync = () => {
      reset();
      if (motion.matches) panel.addEventListener("pointermove", move, { passive: true });
      else panel.removeEventListener("pointermove", move);
    };
    sync();
    motion.addEventListener("change", sync);
    panel.addEventListener("pointerleave", reset);
    panel.addEventListener("pointercancel", reset);
    return () => {
      motion.removeEventListener("change", sync);
      panel.removeEventListener("pointermove", move);
      panel.removeEventListener("pointerleave", reset);
      panel.removeEventListener("pointercancel", reset);
    };
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero__panel" ref={panelRef}>
        <div className="hero__content">
          <div className="hero__badge"><span />Open to remote internships</div>
          <p className="hero__greeting">👋, my name is Devesh and I am a fullstack Developer</p>
          <h1 className="hero__title">WEB <span>DEVELOPER</span></h1>
          <p className="hero__location">based in IIT Roorkee, India.</p>
          <div className="hero__actions">
            <a className="hero__cta" href="#work">View my projects</a>
            <a className="hero__cta hero__cta--secondary" href="#about">Hire me as an intern</a>
          </div>
          <a className="hero__resume" href="/Devesh_Resume.pdf" download>
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M12 3v12m-5-5 5 5 5-5M4 15v5h16v-5" />
            </svg>
            Download Resume
          </a>
        </div>
        <OrbitalArtwork />
        <button type="button" className="hero__scroll" aria-label="Scroll to work"
          onClick={() => document.getElementById("work")?.scrollIntoView()}>
          <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 4v16m-7-7 7 7 7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
