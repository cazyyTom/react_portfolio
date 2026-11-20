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

import { observeScenes } from "./utils/section-scenes.js";

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
let enginePromise;
observeScenes(() => {
  enginePromise ??= loader.track("scene", import("./three/scene.js").then(({createSceneManager}) => {
    if (!signal.aborted) scene = createSceneManager(document.querySelector("#scene"), loader.manager);
    return scene;
  }));
  return enginePromise;
}, signal);

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
