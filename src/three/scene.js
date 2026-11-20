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
  function register(element, { group = new Group(), onEnter, onLeave, onProgress, dispose } = {}) {
    group.name = element.dataset.section;
    group.visible = false;
    scene.add(group);
    function update(trigger) {
      if (group.visible !== trigger.isActive) {
        group.visible = trigger.isActive;
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
    sections.push({ trigger, group, dispose });
    return group;
  }

  return {
    loadingManager,
    register,
    render() {
      renderer?.draw(scene, sections.some(({ group }) => group.visible && group.children.length > 0));
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
