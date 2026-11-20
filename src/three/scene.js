import { Group, PerspectiveCamera, Scene } from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createRenderer } from "./renderer.js";

export function createSceneManager(canvas, loadingManager) {
  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 5;
  const sections = [];
  let renderer;
  try {
    renderer = createRenderer(canvas, camera);
  } catch (error) {
    console.warn(error);
  }
  canvas.hidden = !renderer;

  // A section owns the resources it attaches to its group and releases them in dispose.
  function register(element, { group = new Group(), onEnter, onLeave, onProgress, onFrame, dispose } = {}) {
    group.name = element.dataset.section;
    group.visible = false;
    scene.add(group);
    function update(trigger) {
      if (group.visible !== trigger.isActive) {
        group.visible = trigger.isActive;
        renderer?.invalidate();
        if (group.visible) onEnter?.(group);
        else onLeave?.(group);
      }
      group.userData.progress = trigger.progress;
      onProgress?.(trigger.progress, group);
    }
    const trigger = ScrollTrigger.create({
      trigger: element, start: "top bottom", end: "bottom top",
      onUpdate: update, onRefresh: update,
    });
    update(trigger);
    sections.push({ trigger, group, onFrame, dispose });
    return group;
  }

  return {
    loadingManager, canvas, camera, scene,
    hasWebGL: Boolean(renderer),
    register,
    render(time, deltaMs) {
      if (!renderer || renderer.contextLost()) return;
      let needsFrame = false;
      for (const section of sections) {
        if (section.group.visible && section.group.children.length) {
          if (section.onFrame?.(time, deltaMs) !== false) needsFrame = true;
        }
      }
      renderer.draw(scene, needsFrame);
    },
    dispose() {
      for (const section of sections) {
        section.trigger.kill();
        section.dispose?.(section.group);
        scene.remove(section.group);
      }
      sections.length = 0;
      renderer?.dispose();
    },
  };
}
