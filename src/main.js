import "lenis/dist/lenis.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { startLoop } from "./three/loop.js";
import { initLightPanels } from "./utils/light-panel.js";
import { createPreloader } from "./utils/preloader.js";
import { initContact } from "./utils/contact.js";

const controller = new AbortController();
const { signal } = controller;
const progress = document.querySelector("#preloader");
const loader = createPreloader(progress);
let scene;
const stopLoop = startLoop((time, deltaMs) => scene?.render(time, deltaMs));
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
  scene?.dispose();
  loader.manager.onStart = loader.manager.onProgress = loader.manager.onLoad = undefined;
  progress.hidden = true;
}

window.addEventListener("pagehide", (event) => {
  if (!event.persisted) dispose();
}, { signal });
if (import.meta.hot) import.meta.hot.dispose(dispose);
