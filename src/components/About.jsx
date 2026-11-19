import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import SkillMarquee from "./SkillMarquee";
import "./About.css";

const skills = [
  { group: "Frontend", names: ["React", "Next.js", "Tailwind CSS", "HTML/CSS"] },
  { group: "Backend", names: ["Typescript", "Node.js", "Express", "REST APIs"] },
  { group: "AI/Automation", names: ["Vercel AI SDK", "RAG Pipelines", "Pinecone", "Inngest"] },
  { group: "Databases", names: ["PostgreSQL", "MongoDB"] },
  { group: "Tools", names: ["Git", "Vercel", "Postman", "Docker (basic)", "Appwrite", "GitHub API/Webhooks"] },
];

export default function About() {
  const introRef = useRevealOnScroll(0.12);

  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-intro" ref={introRef}>
        <div className="about-ornaments" aria-hidden="true">
          <span className="about-flower" />
          <span className="about-crystal" />
          <span className="about-loop" />
        </div>
        <div className="about-copy">
          <h2 id="about-title">About Me</h2>
          <p className="about-lead">Fresher, ready to contribute.</p>
          <div className="about-bio">
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
          </div>
          <a className="about-resume" href="/Devesh_Resume.pdf" download>Download Resume</a>
        </div>
      </div>
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
      <SkillMarquee groups={skills} />
    </section>
  );
}
