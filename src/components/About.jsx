import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useMagneticHover } from "../hooks/useMagneticHover";
import "./About.css";

const skills = [
  { label: "Frontend: React, Next.js, Tailwind CSS, HTML/CSS" },
  { label: "Backend: Typescript, Node.js, Express, REST APIs" },
  {
    label:
      "AI/Automation: Vercel AI SDK, RAG Pipelines, Pinecone, Inngest",
  },
  { label: "Databases: PostgreSQL, MongoDB" },
  {
    label:
      "Tools: Git, Vercel, Postman, Docker (basic), Appwrite, GitHub API/Webhooks",
  },
];

function SkillItem({ skill, index }) {
  const ref = useRevealOnScroll(0.3);
  return (
    <div ref={ref} className="skill-item reveal-item" style={{ "--delay": `${index * 0.08}s` }}>
      <span className="skill-item__dot" />
      <span className="skill-item__label">{skill.label}</span>
    </div>
  );
}

export default function About() {
  const headRef = useRevealOnScroll(0.2);
  const bioRef = useRevealOnScroll(0.15);
  const { ref: btnRef, onMouseMove, onMouseLeave } = useMagneticHover(0.35);

  return (
    <section className="about-section" id="about">
      <div className="about-section__inner">
        <div className="section-header reveal-item" ref={headRef}>
          <span className="section-eyebrow">About Me</span>
          <h2 className="section-title">
            Fresher, ready<br />
            <em>to contribute.</em>
          </h2>
        </div>

        <div className="about-body">
          {/* Bio column */}
          <div ref={bioRef} className="about-bio reveal-item">
            <p>
              Hi — I'm Devesh, a full stack developer based in IIT Roorkee, India.
              I'm a fresher actively looking for a remote internship where I can
              learn fast, ship real features, and grow alongside an experienced team.
            </p>
            <p>
              I build end-to-end web applications — from REST APIs and database design
              to responsive, accessible frontends. I'm comfortable picking up new tools
              quickly and enjoy turning ambiguous problems into working software.
            </p>
            <div className="about-bio__stats">
              <div className="stat">
                <span className="stat__num">10+</span>
                <span className="stat__label">Projects built</span>
              </div>
              <div className="stat">
                <span className="stat__num">Fresher</span>
                <span className="stat__label">Open to intern roles</span>
              </div>
              <div className="stat">
                <span className="stat__num">Remote</span>
                <span className="stat__label">Available anywhere</span>
              </div>
            </div>
            <a
              ref={btnRef}
              href="/resume.pdf"
              className="about-bio__resume-btn"
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              download
            >
              Download Resume
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          </div>

          {/* Skills column */}
          <div className="about-skills">
            <p className="about-skills__heading">Tech stack</p>
            {skills.map((s, i) => (
              <SkillItem key={s.label} skill={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
