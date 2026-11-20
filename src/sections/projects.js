import { link, list } from "../utils/html.js";

function collage(project) {
  const image = project.image;
  if (!image?.src)
    return '<div class="project-collage project-placeholder" aria-hidden="true"></div>';
  const frame = (
    detail,
  ) => `<span class="project-frame ${detail ? "project-detail" : "project-overview"}">
    <img src="${image.src}" alt="${detail ? "" : image.alt}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async">
  </span>`;
  const composition = `<span class="project-pictures">${frame(false)}${frame(true)}</span>`;
  return project.demo?.href
    ? `<a class="project-collage" href="${project.demo.href}" aria-label="${image.linkLabel || project.demo.label}">${composition}<span class="preview-label">${project.demo.label}</span></a>`
    : `<div class="project-collage">${composition}</div>`;
}

function projectCard(project, label, index) {
  return `<div class="project-marker" aria-hidden="true"></div>
    <article class="project-sheet" style="--order:${index}" aria-labelledby="project-${index}">
      <div class="project-surface">
        <header class="project-bar"><span class="project-number">${project.id}</span>
          <span>${project.meta}</span>
          ${project.demo?.href ? link({ ...project.demo, label }, 'class="pill" target="_blank" rel="noreferrer"') : ""}
        </header>
        <h3 id="project-${index}">${project.title}</h3>
        <div class="project-body">${collage(project)}
          <div class="project-notes"><p>${project.desc}</p>
            <ul class="tags">${list(project.tags, (tag) => `<li>${tag}</li>`)}</ul>
            ${project.repo?.href ? link(project.repo, 'target="_blank" rel="noreferrer"') : ""}
          </div>
        </div>
      </div>
    </article>`;
}

export function projects(data) {
  return `<section id="work" data-section="projects" class="light-panel" aria-labelledby="work-title" tabindex="-1">
    <div class="container">
      <header class="projects-heading"><p class="eyebrow">${data.eyebrow}</p><h2 id="work-title">${data.title}</h2>
        <div><p>${data.intro}</p>${link(data.github, 'target="_blank" rel="noreferrer"')}</div>
      </header>
      <div class="project-stack">${list(data.entries, (project, index) => projectCard(project, data.liveLabel, index))}</div>
    </div>
  </section>`;
}
