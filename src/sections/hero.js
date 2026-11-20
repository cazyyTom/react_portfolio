import { link, list } from "../utils/html.js";

// Only place artwork for technologies that are present in the portfolio.
const marks = { React: "react", "Tailwind CSS": "tailwind", Git: "git", Vercel: "vercel" };

export function hero(data, name, skillGroups) {
  const skills = skillGroups.flatMap(({ names }) => names).filter((skill) => marks[skill]);
  return `<section id="home" data-section="hero" aria-labelledby="hero-title" tabindex="-1">
    <div class="container hero-layout">
      <div class="hero-meta"><span class="availability">${data.availability}</span><span>${data.title}</span></div>
      <div class="hero-stage">
        <h1 id="hero-title">${name}</h1>
        <div class="hero-orbits" aria-hidden="true"></div>
        ${list(skills, (skill) => `<div class="hero-mark" data-mark="${marks[skill]}" aria-hidden="true">
          <svg><use href="/skill-icons.svg#${marks[skill]}"></use></svg>
        </div>`)}
        <div class="avatar-target"><img class="portrait" src="${data.portrait.src}" alt="${data.portrait.alt}" width="440" height="480" fetchpriority="high" draggable="false"></div>
      </div>
      <div class="hero-intro">
        <div><p class="greeting">${data.greeting}</p><p class="location">${data.location}</p></div>
        ${link(data.contact, 'class="hero-contact pill"')}
      </div>
      <div class="hero-links"><div>${list(data.actions, (action) => link(action))} ${link(data.resume, "download")}</div>
        ${link(data.scroll, 'class="scroll-link"')}
      </div>
    </div>
  </section>`;
}
