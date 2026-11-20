import { list } from "../utils/html.js";

export function skills(data) {
  return `<section id="skills" data-section="skills" aria-labelledby="skills-title" tabindex="-1">
    <div class="container">
      <h2 id="skills-title">${data.title}</h2>
      <div class="skill-groups">${list(data.groups, ({ group, names }) =>
        `<div><h3>${group}</h3><ul class="tags">${list(names, (name) => `<li>${name}</li>`)}</ul></div>`)}
      </div>
    </div>
  </section>`;
}
