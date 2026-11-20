import { link, list } from "../utils/html.js";

function projectCard(project) {
  return `<article class="entry">
    <header><p class="eyebrow">${project.id} &nbsp; ${project.meta}</p><h3>${project.title}</h3></header>
    <a href="${project.demo.href}" aria-label="${project.image.linkLabel}">
      <img src="${project.image.src}" alt="${project.image.alt}" width="${project.image.width}" height="${project.image.height}" loading="lazy" decoding="async">
    </a>
    <p>${project.desc}</p>
    <ul class="tags">${list(project.tags, (tag) => `<li>${tag}</li>`)}</ul>
    <div class="actions">${link(project.demo, 'target="_blank" rel="noreferrer"')}
      ${link(project.repo, 'target="_blank" rel="noreferrer"')}</div>
  </article>`;
}

export function projects(data) {
  return `<section id="work" data-section="projects" class="light-panel" aria-labelledby="work-title" tabindex="-1">
    <div class="container">
      <p class="eyebrow">${data.eyebrow}</p><h2 id="work-title">${data.title}</h2>
      <p>${data.intro}</p>${link(data.github, 'target="_blank" rel="noreferrer"')}
      ${list(data.entries, projectCard)}
    </div>
  </section>`;
}
