import { list } from "../utils/html.js";

const logos = {
  React: "react",
  "Tailwind CSS": "tailwind",
  Git: "git",
  Vercel: "vercel",
};
const symbols = [
  "m8 5-6 7 6 7m8-14 6 7-6 7",
  "M3 5h18v6H3z M3 14h18v6H3z M6 8h2m-2 9h2",
  "M12 2v5m0 10v5M2 12h5m10 0h5 M7 7h10v10H7z",
  "M3 6c0-5 18-5 18 0s-18 5-18 0v12c0 5 18 5 18 0V6 M3 12c0 5 18 5 18 0",
  "m5 18 6-6m2-2 5-5m-1-2 4 4-3 3-4-4z M3 17l4 4 6-6-4-4z",
];

export function skills(data) {
  const cards = data.groups.flatMap(({ group, names }, i) =>
    names.map((name) => {
      const icon = logos[name]
        ? `<svg aria-hidden="true"><use href="/skill-icons.svg#${logos[name]}"/></svg>`
        : `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="${symbols[i % symbols.length]}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`;
      return `<li class="skill-card">${icon}<span><small>${group}</small>${name}</span></li>`;
    }),
  );
  const rows = Array.from({ length: 3 }, (_, i) =>
    cards.slice(
      Math.floor((i * cards.length) / 3),
      Math.floor(((i + 1) * cards.length) / 3),
    ),
  );
  return `<section id="skills" data-section="skills" aria-labelledby="skills-title" tabindex="-1">
    <div class="container"><h2 id="skills-title">${data.title}</h2></div>
    ${list(rows, (cards) => `<div class="skill-window"><div class="skill-track"><ul>${cards.join("")}</ul></div></div>`)}
  </section>`;
}
