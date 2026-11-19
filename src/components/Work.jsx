import { useLayoutEffect, useRef } from "react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import "./Work.css";

const projects = [
  {
    id: "01",
    title: "JudGit - AI-Powered GitHub Code Review Platform",
    category: "Full Stack / Next.js",
    year: "2026",
    desc: "Built JudGit, a SaaS platform that automates pull request reviews using retrieval-augmented AI. Built with Next.js (App Router) and TypeScript, I designed a GitHub OAuth flow via Better Auth and a Prisma/PostgreSQL schema to manage repository connections, reviews, and webhook lifecycles. I engineered an event-driven architecture using GitHub webhooks and Inngest to orchestrate durable, multi-step background jobs — indexing repository source files into a Pinecone vector store and generating contextual AI reviews with the Vercel AI SDK and Google Gemini. The RAG pipeline retrieves relevant codebase context per pull request before generating a structured review (including Mermaid sequence diagrams), which is posted back to GitHub via the Octokit REST API. I also built a live analytics dashboard with TanStack Query and Recharts, visualizing commit, pull request, and AI review activity pulled directly from the GitHub GraphQL API.",
    tags: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "Inngest",
      "Pinecone",
      "Google Gemini",
      "GitHub API",
    ],
    githubUrl: "https://github.com/cazyyTom/JudGit",
    demoUrl: "https://judgitv1-blond.vercel.app/",
    image: "/JudGit.jpg",
  },
  {
    id: "02",
    title: "SmartSolve - AI QnA Platform",
    category: "Full Stack / Next.js",
    year: "2026",
    desc: "Developed SmartSolve, a full-stack developer collaboration platform designed to streamline community knowledge sharing. Built with Next.js (App Router), TypeScript, and Tailwind CSS, I engineered the core frontend workflows and data fetching patterns, ensuring smooth data serialization across server and client boundaries. I integrated Appwrite (TablesDB, Auth, and Storage) to manage user sessions, asynchronous rich-text image uploads, and complex relational schemas for voting, tagging, and commenting. Additionally, I refactored legacy UI components into clean, semantic HTML, delivering a highly responsive, custom-themed design featuring a hardware-accelerated dual-panel sliding authentication flow.",
    tags: ["Next.js", "Tailwind CSS", "AppWrite", "Gemini API", "TypeScript"],
    githubUrl: "https://github.com/cazyyTom/smartsolve",
    demoUrl: "https://smartsolvev10.vercel.app/",
    image: "/QnA.jpg",
  },
  {
    id: "03",
    title: "Product Basecamp Management",
    category: "Full Stack / MERN",
    year: "2026",
    desc: "A collaborative project management platform where teams can organize work across projects using Kanban boards and list views, break tasks into subtasks, and keep shared notes in one place. Built the full auth system from scratch — JWT access/refresh tokens, email verification, and password reset — along with role-based permissions so project owners can control who sees and edits what.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Postman", "JWT"],
    githubUrl: "https://github.com/cazyyTom/product_management",
    demoUrl: "https://product-management-l9no-zeta.vercel.app/",
    image: "/pbm.jpg",
  },
];

function ProjectCard({ project, index }) {
  const cardRef = useRevealOnScroll(0.08);
  return (
    <article ref={cardRef} className="project-card scroll-reveal" style={{ "--index": index }}>
      <header className="project-card__header">
        <span className="project-card__number">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <p className="project-card__meta">{project.category} · {project.year}</p>
          <h3>{project.title}</h3>
        </div>
        <a className="project-card__action" href={project.demoUrl} target="_blank" rel="noreferrer">Live Demo</a>
      </header>
      <div className="project-card__body">
        <a className="project-card__media" href={project.demoUrl} aria-label={`Open live demo of ${project.title}`}>
          {project.image ? <img src={project.image} alt={`${project.title} screenshot`} /> : <strong>{project.title}</strong>}
        </a>
        <div className="project-card__details">
          <p>{project.desc}</p>
          <ul>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
          <a className="project-card__action" href={project.githubUrl} target="_blank" rel="noreferrer">View Git Repo</a>
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const heading = useRevealOnScroll(.2);
  const stack = useRef(null);
  useLayoutEffect(() => {
    const list = stack.current;
    const measure = () => {
      // Keep long descriptions and all actions reachable on short screens and at zoom.
      const top = parseFloat(getComputedStyle(list).scrollPaddingTop);
      const step = parseFloat(getComputedStyle(list).getPropertyValue("--stack-step"));
      const tallest = Math.max(...Array.from(list.children, card => card.offsetHeight));
      const fits = top + (list.children.length - 1) * step + tallest + 16 <= window.innerHeight;
      list.classList.toggle("can-stack", fits);
    };
    measure();
    const resize = new ResizeObserver(measure);
    Array.from(list.children).forEach(card => resize.observe(card));
    window.addEventListener("resize", measure);
    return () => {
      resize.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="work-section__inner">
        <header className="work-heading scroll-reveal" ref={heading}>
          <p>Selected Work</p>
          <h2 id="work-title">Projects</h2>
          <div><span>Things I've built &amp; shipped.</span>
            <a href="https://github.com/cazyyTom" target="_blank" rel="noreferrer">View GitHub →</a>
          </div>
        </header>
        <div className="work-grid" ref={stack}
          onFocus={event => {
            if (event.target.matches(":focus-visible")) event.target.scrollIntoView({ block: "center", behavior: "instant" });
          }}>
          {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
        </div>
      </div>
    </section>
  );
}
