import { link, list } from "../utils/html.js";

export function footer(data, ui) {
  return `<footer id="contact" data-section="footer" class="light-panel" aria-labelledby="contact-title" tabindex="-1">
    <div class="container">
      <p class="eyebrow">${data.availability}</p>
      <h2 id="contact-title" class="email"><a data-email href="mailto:${data.email}" data-copied="${data.mailCopied}">${data.email}</a></h2>
      <button type="button" data-copy data-copied="${data.copied}" hidden>${data.copy}</button>
      <p><a class="brand" href="${ui.home}">${ui.brand}</a></p><p>${data.tagline}</p>
      <nav aria-label="${data.navigation}"><h3>${data.sitemap}</h3>
        <div class="actions">${list(data.links, (item) => link(item))}</div>
      </nav>
      <h3>${data.social}</h3><div class="actions">${list(data.socials, (item) => link(item, 'target="_blank" rel="noreferrer"'))}</div>
      <small>${data.copyright.replace("{year}", String(new Date().getFullYear()))} ${data.credit}</small>
    </div>
  </footer>`;
}
