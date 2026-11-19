import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import "./Projects.css";

const experience = [
  {
    id: 1,
    title: "Web Developer, Mount Diggers.",
    desc: "Led the end-to-end development and deployment of the Mount Diggers website, delivering a scalable and user-centric digital experience for the startup.",
    image: "/mountdiggers.jpg",
    website: "https://www.mountdiggers.com/",
    certificateUrl:
      "https://drive.google.com/file/d/1PJb2TvxIt0JsiLdK2zMLKkd02_nGJkOY/view?usp=sharing",
  },
];

function ExperienceRow({ entry, index }) {
  const ref = useRevealOnScroll(0.12);
  return (
    <article className="experience-row" ref={ref}>
      <div className="experience-number" aria-hidden="true">
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="experience-details">
        <h3><span>{entry.title}</span></h3>
        <p>{entry.desc}</p>
        <div className="experience-links">
          <a className="experience-certificate" href={entry.certificateUrl} target="_blank" rel="noreferrer">
            View Certificate
          </a>
          <a className="experience-site" href={entry.website} aria-label={`Open ${entry.title}`}>
            <img src={entry.image} width="1350" height="637" alt="Mount Diggers website" />
            <span>{new URL(entry.website).hostname.replace(/^www\./, "")}</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const heading = useRevealOnScroll(0.15);
  return (
    <section className="experience" id="projects" aria-labelledby="experience-title">
      <div className="experience-panel">
        <header className="experience-heading" ref={heading}>
          <h2 id="experience-title">Work Experience</h2>
          <p>Code that performs <span>Experience that engage.</span></p>
        </header>
        <div className="experience-list">
          {experience.map((entry, index) => <ExperienceRow key={entry.id} entry={entry} index={index} />)}
        </div>
      </div>
    </section>
  );
}
