import { hero } from "../sections/hero.js";
import { about } from "../sections/about.js";
import { skills } from "../sections/skills.js";
import { projects } from "../sections/projects.js";
import { experience } from "../sections/experience.js";
import { footer } from "../sections/footer.js";
import { escapeContent, link, list } from "./html.js";

export function renderPage(content) {
  const data = escapeContent(content);
  return {
    meta: `<title>${data.meta.title}</title>
      <meta name="description" content="${data.meta.description}">`,
    body: `<canvas id="scene" aria-hidden="true"></canvas>
      <progress id="preloader" max="1" value="0" aria-label="${data.ui.loading}" hidden></progress>
      <header class="site-header">
        <a class="brand" href="${data.ui.home}">${data.ui.brand}</a>
        <nav aria-label="${data.ui.navigation}">${list(data.ui.nav, (item) => link(item))}</nav>
      </header>
      <main>${hero(data.hero)}${about(data.about)}${skills(data.skills)}
        ${projects(data.projects)}${experience(data.experience)}</main>
      ${footer(data.footer, data.ui)}`,
  };
}
