import "lenis/dist/lenis.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { startLoop } from "./three/loop.js";
import { initLightPanels } from "./utils/light-panel.js";
import { createPreloader } from "./utils/preloader.js";
import { initContact } from "./utils/contact.js";

import { initAboutMotion } from "./utils/about-motion.js";
import { initMarquee } from "./utils/skill-marquee.js";

import { initProjectsMotion } from "./utils/projects-motion.js";

import { initExperienceMotion } from "./utils/experience-motion.js";

const controller = new AbortController();
const { signal } = controller;
const progress = document.querySelector("#preloader");
const loader = createPreloader(progress);
let scene;
const marquee = initMarquee(signal);
const stopLoop = startLoop((time, deltaMs, velocity) => {
  marquee(deltaMs, velocity);
  scene?.render(time, deltaMs);
});
const stopAbout = initAboutMotion();
const stopProjects = initProjectsMotion();
const stopExperience = initExperienceMotion();
const stopPanels = initLightPanels();
initContact(signal);

const portrait = document.querySelector(".portrait");
loader.track(portrait.currentSrc || portrait.src, portrait.decode()).catch(console.warn);
loader.track("scene", import("./three/scene.js").then(async ({ createSceneManager }) => {
  if (signal.aborted) return;
  scene = createSceneManager(document.querySelector("#scene"), loader.manager);
  for (const element of document.querySelectorAll("[data-section]")) {
    let options;
    if (scene.hasWebGL && element.dataset.section === "hero") {
      const { createHero } = await import("./three/hero.js");
      if (signal.aborted) return;
      options = await createHero(element, scene, signal);
      if (signal.aborted) return;
    }
    if (scene.hasWebGL && element.dataset.section === "about") {
      const {createAbout} = await import("./three/about.js");
      if (signal.aborted) return;
      options=createAbout(element,scene,signal);
    }
    if (scene.hasWebGL && element.dataset.section === "projects") {
      const { createProjectGlow } = await import("./three/projects.js");
      if (signal.aborted) return;
      options = createProjectGlow(element, scene);
    }
    if (scene.hasWebGL && element.dataset.section === "footer") {
      const observer = new IntersectionObserver(async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        try {
          const { createFooter } = await import("./three/footer.js");
          if (!signal.aborted) scene.register(element, createFooter(element, scene, signal));
        } catch (error) {
          console.warn(error);
        }
      }, {rootMargin:"450px"});
      observer.observe(element);
      signal.addEventListener("abort", () => observer.disconnect(), {once:true});
      continue;
    }
    scene.register(element, options);
  }
  ScrollTrigger.refresh();
})).catch(console.warn);

document.fonts.ready.then(() => {
  if (!signal.aborted) ScrollTrigger.refresh();
});

function dispose() {
  controller.abort();
  stopLoop();
  stopPanels();
  stopExperience();
  stopAbout();
  stopProjects();
  scene?.dispose();
  loader.manager.onStart = loader.manager.onProgress = loader.manager.onLoad = undefined;
  progress.hidden = true;
}

window.addEventListener("pagehide", (event) => {
  if (!event.persisted) dispose();
}, { signal });
if (import.meta.hot) import.meta.hot.dispose(dispose);
