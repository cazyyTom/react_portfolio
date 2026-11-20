// Keep GPU resources only for visible sections. An aborted load may still
// resolve after a fast scroll, so dispose its result before registering it.
const factories = {
  hero: () => import("../three/hero.js").then(m => m.createHero),
  about: () => import("../three/about.js").then(m => m.createAbout),
  projects: () => import("../three/projects.js").then(m => m.createProjectGlow),
  footer: () => import("../three/footer.js").then(m => m.createFooter),
};

export function observeScenes(getEngine, signal) {
  const active = new Map();
  const visible = new Set();
  const compact = matchMedia("(max-width: 48rem), (pointer: coarse), (prefers-reduced-motion: reduce)");
  let heroInteractive = false;

  async function enter(element) {
    const key = element.dataset.section;
    if (compact.matches || active.has(element) || (key === "hero" && !heroInteractive)) return;
    const controller = new AbortController();
    const record = { controller };
    active.set(element, record);
    try {
      const engine = await getEngine();
      if (controller.signal.aborted || !engine?.hasWebGL) return;
      const create = await factories[key]();
      if (controller.signal.aborted) return;
      const options = await create(element, engine, controller.signal);
      if (controller.signal.aborted) return options?.dispose?.();
      const group = engine.register(element, options);
      record.release = () => engine.unregister(group);
    } catch (error) {
      if (!controller.signal.aborted) console.warn(error);
    }
  }
  function leave(element) {
    const record = active.get(element);
    if (!record) return;
    record.controller.abort();
    record.release?.();
    active.delete(element);
  }
  const observer = new IntersectionObserver(entries => {
    for (const {target,isIntersecting} of entries) {
      if (isIntersecting) { visible.add(target); enter(target); }
      else { visible.delete(target); leave(target); }
    }
  });
  for (const section of document.querySelectorAll("[data-section]")) {
    if (factories[section.dataset.section]) observer.observe(section);
  }
  const hero = document.querySelector('[data-section="hero"]');
  function engage() {
    heroInteractive = true;
    if (visible.has(hero)) enter(hero);
  }
  hero.addEventListener("pointermove", engage, {once:true,signal});
  hero.addEventListener("focusin", engage, {once:true,signal});
  compact.addEventListener("change", () => {
    for (const section of visible) compact.matches ? leave(section) : enter(section);
  }, {signal});
  signal.addEventListener("abort", () => {
    observer.disconnect();
    for (const section of active.keys()) leave(section);
  }, {once:true});
}
