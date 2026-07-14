import { useRef, useEffect } from "react";
import { useMagneticHover } from "../hooks/useMagneticHover";
import "./Hero.css";

function ArrowButton() {
  const { ref, onMouseMove, onMouseLeave } = useMagneticHover(0.5);
  return (
    <button
      ref={ref}
      className="hero__arrow-btn"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      aria-label="Scroll to work"
      onClick={() =>
        document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
      }
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </button>
  );
}

function CTAButton({ children, href, outline }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticHover(0.3);
  return (
    <a
      ref={ref}
      href={href}
      className={`hero__cta-btn${outline ? " hero__cta-btn--outline" : ""}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );
}

export default function Hero() {
  const titleRef = useRef(null);

  // Staggered word animation on mount
  useEffect(() => {
    const words = titleRef.current?.querySelectorAll(".hero__word");
    if (!words) return;
    words.forEach((w, i) => {
      w.style.transitionDelay = `${i * 0.08}s`;
      setTimeout(() => w.classList.add("is-visible"), 50);
    });
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero__inner">
        //Hii adding this comment to check if judgit working fine or not
        {/* Greeting line */}
        <p className="hero__greeting">
          <span className="hero__wave">👋</span>, my name is Devesh and I am a
          fullstack Developer
        </p>

        {/* Big typographic headline */}
        <div className="hero__title-block" ref={titleRef}>
          <h1 className="hero__title hero__title--outline">
            <span className="hero__word">WEB</span>
          </h1>

          <h1 className="hero__title hero__title--solid">
            <span className="hero__word">DEVELOPER</span>
            <ArrowButton />
          </h1>

          {/* Image comes AFTER "DEVELOPER" in the DOM so it paints on top
              of it, and is pulled up with a negative margin to overlap
              the bottom of the text — like the reference */}
          <div className="hero-image-wrapper">
            <img
              src="/me.png"
              alt="Devesh - fullStack developer"
              className="hero-image"
            />
          </div>
        </div>

        {/* Sub-line + open-to-work badge */}
        <div className="hero__meta">
          <p className="hero__location">based in IIT Roorkee, India.</p>
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Open to remote internships
          </div>
        </div>

        {/* CTA buttons */}
        <div className="hero__cta-group">
          <CTAButton href="#work">View my projects</CTAButton>
          <CTAButton href="#about" outline>
            Hire me as an intern
          </CTAButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-indicator">
        <span />
      </div>
    </section>
  );
}
