import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useMagneticHover } from "../hooks/useMagneticHover";
import "./Work.css";
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
          <img
            src={project.image}
            alt="Devesh - fullStack developer"
            className="w-full h-full object-cover project-image"
          />
        </div>
        <a
          ref={hoverRef}
          href={project.demoUrl}
          className="project-card__view-btn"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          aria-label={`View ${project.title} on GitHub`}
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
      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="project-card__category">{project.category}</span>
          <span className="project-card__year">{project.year}</span>
        </div>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.desc}</p>
        <div className="project-card__tags">
          {project.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <div className="demo__cta-group mb-1">
          <CTAButton href={project.demoUrl} outline>
            Live Demo
          </CTAButton>
        </div>
        <div className="demo__cta-group">
          <CTAButton href={project.githubUrl} outline>
            View Git Repo
          </CTAButton>
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
