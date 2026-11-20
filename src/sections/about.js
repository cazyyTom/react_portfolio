import { link, list } from "../utils/html.js";

export function about(data, contact) {
  return `<section id="about" class="light-panel" data-section="about" aria-labelledby="about-title" tabindex="-1">
    <div class="container">
      <div class="about-stage"><h2 id="about-title">${data.title}</h2>
        <i></i><i></i><i></i></div><div class="about-copy">
      <p class="lead">${data.lead}</p>
      ${list(data.bio, (text) => `<p class="bio-line-source">${text}</p>`)}
      <div class="actions">${link(contact, 'class="pill"')} ${link(data.resume, "download")}</div></div>
      <dl class="stats">${list(
        data.stats,
        ({ label, value }) => `<div><dt>${label}</dt><dd>${value}</dd></div>`,
      )}
      </dl>
    </div>
  </section>`;
}
