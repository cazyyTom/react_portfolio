import { link, list } from "../utils/html.js";

export function experience(data) {
  return `<section id="projects" data-section="experience" aria-labelledby="experience-title" tabindex="-1">
    <div class="container">
      <h2 id="experience-title">${data.title}</h2><p>${data.intro}</p>
      ${list(data.entries, (job) => `<article class="entry">
        <p class="eyebrow">${job.id}</p><h3>${job.title}</h3><p>${job.desc}</p>
        <a href="${job.website.href}" aria-label="${job.image.linkLabel}">
          <img src="${job.image.src}" alt="${job.image.alt}" width="1350" height="637" loading="lazy" decoding="async">
          ${job.website.label}
        </a>
        <p>${link(job.certificate, 'target="_blank" rel="noreferrer"')}</p>
      </article>`)}
    </div>
  </section>`;
}
