import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useMagneticHover } from "../hooks/useMagneticHover";
import "./Projects.css";
function CTAButton({ children, href, outline }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticHover(0.3);
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`demo__cta-btn${outline ? " demo__cta-btn--outline" : ""}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      >
      {children}
    </a>
  );
}

const demos = [
  {
    id: 1,
    title: "Web Developer, Mount Diggers.",
    desc: "Led the end-to-end development and deployment of the Mount Diggers website, delivering a scalable and user-centric digital experience for the startup.",
    type: "image",
    certificateUrl:
      "https://drive.google.com/file/d/1PJb2TvxIt0JsiLdK2zMLKkd02_nGJkOY/view?usp=sharing",
  },
];

function DemoCard({ demo, index }) {
  const ref = useRevealOnScroll(0.1);
  const { ref: hoverRef, onMouseMove, onMouseLeave } = useMagneticHover(0.12);

  return (
    <article
      ref={ref}
      className="demo-card reveal-item"
      style={{ "--delay": `${index * 0.08}s` }}
    >
      <div className="demo-card__media-wrap">
        {/* Replace this placeholder with an <img src="..."> or <video src="..." controls> */}
        <div className="demo-card__placeholder">
          {demo.type === "video" ? (
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          ) : (
            <img
              src="/mountdiggers.jpg"
              alt="Devesh - fullStack developer"
              className="hero-image"
            />
          )}
        </div>
        <a
          ref={hoverRef}
          href="https://www.mountdiggers.com/"
          className="demo-card__view-btn"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          aria-label={`Open ${demo.title}`}
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
        </a>
      </div>
      <div className="demo-card__body">
        <h3 className="demo-card__title">{demo.title}</h3>
        <p className="demo-card__desc">{demo.desc}</p>
        <div className="demo__cta-group">
          <CTAButton href={demo.certificateUrl} outline>
            View Certificate
          </CTAButton>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const headRef = useRevealOnScroll(0.2);

  return (
    <section className="projects-section" id="projects">
      <div className="projects-section__inner">
        <div className="section-header reveal-item" ref={headRef}>
          <span className="section-eyebrow">Work Experience</span>
          <h2 className="section-title">
            Code that performs<br />
            <em>Experience that engage.</em>
          </h2>
        </div>
        <div className="demo-grid">
          {demos.map((d, i) => (
            <DemoCard key={d.id} demo={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
