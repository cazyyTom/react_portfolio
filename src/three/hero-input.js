import { MathUtils, Vector2 } from "three";

export function createHeroInput(stage, target, signal) {
  const pointer = new Vector2();
  const gaze = new Vector2();
  const coarse = matchMedia("(pointer: coarse)");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let owner = null,
    lastX = 0,
    lastTime = 0;
  let yaw = 0,
    velocity = 0;
  function reset() {
    if (owner !== null && target.hasPointerCapture(owner))
      target.releasePointerCapture(owner);
    owner = null;
    pointer.set(0, 0);
    gaze.set(0, 0);
    yaw = velocity = 0;
  }
  stage.addEventListener(
    "pointermove",
    (event) => {
      if (motion.matches) return;
      if (owner === event.pointerId) {
        const elapsed = Math.max(0.008, (event.timeStamp - lastTime) / 1000);
        const delta = ((event.clientX - lastX) / target.clientWidth) * 3;
        yaw += delta;
        velocity = MathUtils.clamp(delta / elapsed, -8, 8);
        lastX = event.clientX;
        lastTime = event.timeStamp;
      }
    },
    { signal },
  );
  // The gaze can follow the pointer anywhere over the hero, including its text.
  stage.closest("section").addEventListener(
    "pointermove",
    (event) => {
      if (motion.matches || coarse.matches || event.pointerType === "touch")
        return;
      const rect = target.getBoundingClientRect();
      pointer.set(
        MathUtils.clamp(
          (event.clientX - rect.left - rect.width / 2) / (rect.width * 0.85),
          -1,
          1,
        ),
        MathUtils.clamp(
          (event.clientY - rect.top - rect.height * 0.44) /
            (rect.height * 0.65),
          -1,
          1,
        ),
      );
    },
    { signal },
  );
  stage
    .closest("section")
    .addEventListener("pointerleave", () => pointer.set(0, 0), { signal });
  target.addEventListener(
    "pointerdown",
    (event) => {
      if (motion.matches || !event.isPrimary || event.button !== 0) return;
      target.setPointerCapture(event.pointerId);
      owner = event.pointerId;
      velocity = 0;
      lastX = event.clientX;
      lastTime = event.timeStamp;
    },
    { signal },
  );
  function release(event) {
    if (owner !== event.pointerId) return;
    if (event.timeStamp - lastTime > 100) velocity = 0;
    // Spring to the nearest equivalent forward pose after any complete turns.
    yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw));
    owner = null;
  }
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
    target.addEventListener(type, release, { signal });
  motion.addEventListener("change", reset, { signal });
  signal.addEventListener("abort", reset, { once: true });
  return {
    gaze,
    motion,
    reset,
    step(dt, time) {
      if (coarse.matches)
        pointer.set(Math.sin(time * 0.42) * 0.43, Math.sin(time * 0.32) * 0.13);
      if (motion.matches) return 0;
      gaze.lerp(pointer, 1 - Math.exp(-dt * 7));
      if (owner === null) {
        velocity += (-24 * yaw - 7.6 * velocity) * dt;
        yaw += velocity * dt;
      }
      return yaw;
    },
  };
}
