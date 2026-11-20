export function initMarquee(signal) {
  const section = document.querySelector("#skills");
  const motion = matchMedia("(prefers-reduced-motion: no-preference)");
  const rows = [...section.querySelectorAll(".skill-track")].map((track) => ({
    track,
    original: track.firstElementChild,
    phase: 0,
    hover: false,
  }));
  let visible = false,
    speed = 30,
    direction = 1,
    viewport = 0;
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  visibility.observe(section);
  function measure() {
    viewport = section.clientWidth;
    section.classList.toggle("skills-moving", motion.matches);
    for (const row of rows) {
      while (row.track.children.length > 1) row.track.lastElementChild.remove();
      row.track.style.transform = "";
      for (const card of row.original.children) card.style.transform = "";
      if (!motion.matches) continue;
      row.width = row.original.getBoundingClientRect().width;
      if (!row.width) continue;
      for (let i = 0; i < Math.ceil(viewport / row.width); i++) {
        const clone = row.original.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        row.track.append(clone);
      }
      row.cards = [...row.track.querySelectorAll("li")];
      row.centers = row.cards.map(
        (card) => card.getBoundingClientRect().left + card.offsetWidth / 2,
      );
    }
  }
  rows.forEach((row) => {
    row.track.addEventListener(
      "pointerenter",
      (e) => {
        row.hover = e.pointerType !== "touch";
      },
      { signal },
    );
    row.track.addEventListener(
      "pointerleave",
      () => {
        row.hover = false;
      },
      { signal },
    );
    row.factor = 1;
  });
  const size = new ResizeObserver(measure);
  size.observe(section);
  motion.addEventListener("change", measure, { signal });
  measure();
  signal.addEventListener(
    "abort",
    () => {
      size.disconnect();
      visibility.disconnect();
    },
    { once: true },
  );
  return (ms, velocity) => {
    if (!motion.matches || !visible) return;
    const dt = Math.min(ms / 1000, 0.06);
    if (Math.abs(velocity) > 0.1) direction = Math.sign(velocity);
    const target = direction * (30 + Math.min(340, Math.abs(velocity) * 8));
    const ease =
      1 - Math.exp(-dt * (Math.abs(target) > Math.abs(speed) ? 8 : 3));
    speed += (target - speed) * ease;
    rows.forEach((row, i) => {
      if (!row.width) return;
      row.factor +=
        ((row.hover ? 0.28 : 1) - row.factor) * (1 - Math.exp(-dt * 6));
      row.phase =
        (row.phase + (speed * dt * row.factor * (i % 2 ? -1 : 1)) / row.width) %
        1;
      const x = (((row.phase + 1) % 1) - 1) * row.width;
      row.track.style.transform = `translate3d(${x}px,0,0)`;
      row.cards.forEach((card, k) => {
        const distance = (row.centers[k] + x - viewport / 2) / (viewport / 2);
        card.style.transform = `perspective(700px) rotateY(${Math.max(-1, Math.min(1, distance)) * 9}deg)`;
      });
    });
  };
}
