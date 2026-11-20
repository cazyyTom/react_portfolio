import { link, list } from "../utils/html.js";

export function footer(data, ui) {
  return `<footer id="contact" data-section="footer" aria-labelledby="contact-title" tabindex="-1">
    <div class="container">
      <div class="contact-stage">
        <div class="contact-intro"><p class="availability">${data.availability}</p>
          <h2 id="contact-title">${data.title}</h2>
          <div class="contact-address"><a data-email href="mailto:${data.email}" data-copied="${data.mailCopied}">${data.email}</a>
          <button type="button" data-copy data-copied="${data.copied}" hidden>${data.copy}</button></div>
        </div>
        <div class="contact-art" aria-hidden="true">
          <i class="contact-prop contact-bolt"></i><i class="contact-prop contact-ring"></i><i class="contact-prop contact-blob"></i>
        </div>
      </div>
      <div class="contact-directory">
        <p>${data.tagline}</p>
        <nav aria-label="${data.navigation}"><h3>${data.sitemap}</h3>
          ${list(data.links, (item) => link(item))}
        </nav>
        <div><h3>${data.social}</h3>${list(data.socials, (item) => link(item, 'target="_blank" rel="noreferrer"'))}</div>
      </div>
      <a class="contact-name" href="${ui.home}"><span>${ui.brand}</span></a>
      <div class="contact-base"><small>${data.copyright.replace("{year}", String(new Date().getFullYear()))}</small>
        <small>${data.credit}</small>${link(data.backToTop, 'class="back-top"')}</div>
    </div>
  </footer>`;
}
