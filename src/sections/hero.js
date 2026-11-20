import { link, list } from "../utils/html.js";

export function hero(data) {
  return `<section id="home" data-section="hero" aria-labelledby="hero-title" tabindex="-1">
    <div class="container hero-layout">
      <div>
        <p class="eyebrow">${data.availability}</p>
        <p>${data.greeting}</p>
        <h1 id="hero-title">${data.title}</h1>
        <p>${data.location}</p>
        <div class="actions">${list(data.actions, (action) => link(action, 'class="pill"'))}</div>
        <div class="actions">${link(data.resume, "download")} ${link(data.scroll)}</div>
      </div>
      <img class="portrait" src="${data.portrait.src}" alt="${data.portrait.alt}" width="1536" height="1024" fetchpriority="high">
    </div>
  </section>`;
}
