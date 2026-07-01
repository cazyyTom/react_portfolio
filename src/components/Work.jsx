import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useMagneticHover } from "../hooks/useMagneticHover";
import "./Work.css";

const projects = [
  {
    id: "01",
    title: "Project One",
    category: "Full Stack / Web App",
    year: "2026",
    desc: "Short description of what this project does, the problem it solves, and your role in building it.",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    id: "02",
    title: "Project Two",
    category: "Frontend / UI Build",
    year: "2026",
    desc: "Short description of what this project does, the problem it solves, and your role in building it.",
    tags: ["Next.js", "Tailwind CSS"],
  },
  {
    id: "03",
    title: "Project Three",
    category: "Backend / REST API",
    year: "2026",
    desc: "Short description of what this project does, the problem it solves, and your role in building it.",
    tags: ["Express", "PostgreSQL"],
  },
  
];

function ProjectCard({ project, index }) {
  const ref = useRevealOnScroll(0.12);
  const { ref: hoverRef, onMouseMove, onMouseLeave } = useMagneticHover(0.12);

  return (
    <article
      ref={ref}
      className="project-card reveal-item"
      style={{ "--delay": `${index * 0.1}s` }}
    >
      <div className="project-card__img-wrap">
        <div className="project-card__img-placeholder">
          <span>{project.id}</span>
        </div>
        <a
          ref={hoverRef}
          href="#"
          className="project-card__view-btn"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          aria-label={`View ${project.title} on GitHub`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      </div>
      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="project-card__category">{project.category}</span>
          <span className="project-card__year">{project.year}</span>
        </div>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.desc}</p>
        <div className="project-card__tags">
          {project.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const headRef = useRevealOnScroll(0.2);

  return (
    <section className="work-section" id="work">
      <div className="work-section__inner">
        <div className="section-header reveal-item" ref={headRef}>
          <span className="section-eyebrow">Selected Work</span>
          <h2 className="section-title">
            Things I've<br />
            <em>built &amp; shipped.</em>
          </h2>
          <a href="https://github.com/cazyyTom" target="_blank" rel="noreferrer" className="section-link">
            View GitHub →
          </a>
        </div>
        <div className="work-grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
