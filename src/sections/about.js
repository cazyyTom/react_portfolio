import { link, list } from "../utils/html.js";

export function about(data) {
  return `<section id="about" class="light-panel" data-section="about" aria-labelledby="about-title" tabindex="-1">
    <div class="container">
      <h2 id="about-title">${data.title}</h2>
      <p class="lead">${data.lead}</p>
      ${list(data.bio, (text) => `<p>${text}</p>`)}
      ${link(data.resume, "download")}
      <dl class="stats">${list(data.stats, ({ label, value }) =>
        `<div><dt>${label}</dt><dd>${value}</dd></div>`)}
      </dl>
    </div>
  </section>`;
}
