import { Group, MathUtils } from "three";
import { createAvatar } from "./avatar.js";
import { createStudio } from "./hero-studio.js";
import { createProps } from "./hero-props.js";
import { createHeroInput } from "./hero-input.js";

function releaseMeshes(group) {
  const resources = new Set();
  group.traverse((object) => {
    if (object.isInstancedMesh) resources.add(object);
    if (object.geometry) resources.add(object.geometry);
    if (!object.material) return;
    for (const material of [].concat(object.material)) {
      resources.add(material);
      for (const value of Object.values(material))
        if (value?.isTexture) resources.add(value);
    }
  });
  for (const resource of resources) resource.dispose();
}

export async function createHero(element, engine, signal) {
  const stage = element.querySelector(".hero-stage");
  const target = stage.querySelector(".avatar-target");
  const group = new Group();
  const props = await createProps(stage, signal);
  if (signal.aborted) {
    releaseMeshes(props.group);
    return;
  }
  const studio = createStudio(group);
  const input = createHeroInput(stage, target, signal);
  const anchor = new Group();
  let avatar = createAvatar();
  anchor.add(avatar.bust);
  group.add(anchor, props.group);
  if (__AVATAR_MODEL__) {
    // TODO(final avatar): confirm the authored Head and pupil pivots on delivery.
    import("./avatar-model.js")
      .then(({ loadAvatar }) =>
        loadAvatar(__AVATAR_MODEL__, engine.loadingManager),
      )
      .then((model) => {
        if (signal.aborted) return releaseMeshes(model.bust);
        anchor.remove(avatar.bust);
        releaseMeshes(avatar.bust);
        avatar = model;
        anchor.add(model.bust);
        refresh = true;
      })
      .catch(console.warn);
  }
  let refresh = true;
  let lastScrollY;
  let viewWidth, viewHeight, unitsPerDepth;
  let elapsed = 0;
  let stageTop = 0,
    stageLeft = 0,
    height = 0;
  let targetX = 0.5,
    targetY = 0.6,
    bustSize = 0;
  const layout = {
    width: 0,
    place(object, u, v, z, size) {
      const units = (engine.camera.position.z - z) * unitsPerDepth;
      object.position.set(
        (stageLeft + u * layout.width - viewWidth / 2) * units,
        (viewHeight / 2 - (stageTop - window.scrollY + v * height)) * units,
        z,
      );
      object.scale.setScalar(size * units);
    },
  };
  function measure() {
    refresh = true;
    viewWidth = engine.canvas.clientWidth;
    viewHeight = engine.canvas.clientHeight;
    unitsPerDepth =
      (2 * Math.tan(MathUtils.degToRad(engine.camera.fov / 2))) / viewHeight;
    const rect = stage.getBoundingClientRect();
    const hit = target.getBoundingClientRect();
    stageTop = rect.top + window.scrollY;
    stageLeft = rect.left;
    height = rect.height;
    layout.width = rect.width;
    targetX = (hit.left + hit.width / 2 - rect.left) / rect.width;
    targetY = (hit.top + hit.height / 2 - rect.top) / height;
    bustSize = Math.min(hit.height / 3.22, hit.width / 2.43);
    props.measure(rect);
  }
  const observer = new ResizeObserver(measure);
  observer.observe(stage);
  observer.observe(target);
  observer.observe(element);
  observer.observe(engine.canvas);
  measure();

  input.motion.addEventListener("change", measure, { signal });
  function frame(_seconds, deltaMs) {
    const reduced = input.motion.matches;
    if (reduced && !refresh && lastScrollY === window.scrollY) return false;
    refresh = false;
    lastScrollY = window.scrollY;
    const dt = Math.min(deltaMs / 1000, 0.04);
    elapsed += dt;
    const time = reduced ? 0 : elapsed;
    const exit = reduced
      ? 0
      : MathUtils.clamp(window.scrollY / element.offsetHeight, 0, 1);
    const yaw = input.step(dt, time);
    const gaze = input.gaze;
    layout.place(
      anchor,
      targetX + exit * 0.09,
      targetY - exit * 0.15 - Math.sin(time * 1.25) * 0.008,
      -exit * 1.3,
      bustSize * (1 - exit * 0.53),
    );
    anchor.rotation.set(
      -0.035 + gaze.y * 0.045,
      -0.1 + yaw + gaze.x * 0.1,
      -0.035 + 0.016 * Math.sin(time * 0.87),
    );
    avatar.head.rotation.y = avatar.restYaw + gaze.x * 0.25;
    avatar.head.rotation.x = avatar.restPitch + gaze.y * 0.14;
    avatar.bust.scale.y = 1 + 0.006 * Math.sin(time * 1.7);
    for (const pupil of avatar.pupils) {
      pupil.position.x = pupil.userData.restX + gaze.x * 0.052;
      pupil.position.y = pupil.userData.restY - gaze.y * 0.036;
    }
    props.update(layout, time, exit, gaze);
    if (!element.classList.contains("hero-live"))
      element.classList.add("hero-live");
    return true;
  }

  engine.canvas.addEventListener(
    "webglcontextlost",
    () => element.classList.remove("hero-live"),
    { signal },
  );
  engine.canvas.addEventListener("webglcontextrestored", measure, { signal });
  return {
    group,
    onFrame: frame,
    onEnter() {
      engine.scene.environment = studio;
      measure();
    },
    onLeave() {
      engine.scene.environment = null;
      input.reset();
    },
    dispose() {
      observer.disconnect();
      element.classList.remove("hero-live");
      if (engine.scene.environment === studio) engine.scene.environment = null;
      studio.dispose();
      releaseMeshes(group);
    },
  };
}
