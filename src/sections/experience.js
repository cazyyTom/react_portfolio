import { link, list } from "../utils/html.js";

function experienceRow(job) {
  return `<li class="experience-row">
    <span class="experience-rule" aria-hidden="true"></span>
    <div class="experience-row-body">
      <span class="experience-number" aria-hidden="true">${job.id}</span>
      <div class="experience-role">
        <h3>${job.title}</h3>
        ${job.dates ? `<p>${job.dates}</p>` : ""}
      </div>
      <div class="experience-detail">
        ${job.desc ? `<p>${job.desc}</p>` : ""}
        ${job.bullets?.length ? `<ul>${list(job.bullets, (text) => `<li>${text}</li>`)}</ul>` : ""}
        ${
          job.website
            ? `<a class="experience-site" href="${job.website.href}" aria-label="${job.website.label}${job.image?.linkLabel ? ` — ${job.image.linkLabel}` : ""}">
          ${job.image ? `<img src="${job.image.src}" alt="${job.image.alt}" width="1350" height="637" loading="lazy" decoding="async">` : ""}
          <span>${job.website.label}</span>
        </a>`
            : ""
        }
        ${job.certificate ? link(job.certificate, 'class="experience-certificate" target="_blank" rel="noreferrer"') : ""}
      </div>
    </div>
  </li>`;
}

export function experience(data) {
  return `<section id="projects" data-section="experience" aria-labelledby="experience-title" tabindex="-1">
    <div class="experience-panel">
      <div class="container">
        <header class="experience-heading">
          <h2 id="experience-title">${data.title}</h2>
          <p>${data.intro}</p>
        </header>
        <ol class="experience-list" role="list">${list(data.entries, experienceRow)}</ol>
        <span class="experience-rule experience-end" aria-hidden="true"></span>
      </div>
    </div>
  </section>`;
}
