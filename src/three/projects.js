import { CanvasTexture, Group, Sprite, SpriteMaterial } from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function createProjectGlow(element, engine) {
  const group = new Group();
  const stops = [...element.querySelectorAll(".project-marker")].map(
    (marker) => ({
      trigger: ScrollTrigger.create({ trigger: marker, start: "top 50%" }),
      color: getComputedStyle(marker.nextElementSibling)
        .getPropertyValue("--accent")
        .trim(),
    }),
  );
  const disc = document.createElement("canvas");
  disc.width = disc.height = 128;
  const ctx = disc.getContext("2d");
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "#fff");
  gradient.addColorStop(0.48, "#ffffff98");
  gradient.addColorStop(1, "#ffffff00");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new CanvasTexture(disc);
  const material = new SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  const glow = new Sprite(material);
  group.add(glow);
  let lastScroll, lastWidth, lastHeight, lastIndex;
  return {
    group,
    onEnter() {
      lastScroll = undefined;
    },
    onFrame() {
      const w = engine.canvas.clientWidth,
        h = engine.canvas.clientHeight;
      const index = Math.max(
        0,
        stops.findLastIndex((stop) => scrollY >= stop.trigger.start),
      );
      if (
        lastScroll === scrollY &&
        lastWidth === w &&
        lastHeight === h &&
        lastIndex === index
      )
        return false;
      lastScroll = scrollY;
      lastWidth = w;
      lastHeight = h;
      lastIndex = index;
      if (!stops.length) return false;
      material.color.set(stops[index].color);
      const bounds = element.getBoundingClientRect();
      const units =
        (2 *
          engine.camera.position.z *
          Math.tan((engine.camera.fov * Math.PI) / 360)) /
        h;
      const diameter = Math.min(w * 0.74, 700);
      const y = Math.max(
        bounds.top + diameter / 2,
        Math.min(h * 0.44, bounds.bottom - diameter / 2),
      );
      glow.position.set(w * 0.43 * units, (h / 2 - y) * units, 0);
      glow.scale.setScalar(diameter * units);
      return true;
    },
    dispose() {
      stops.forEach((stop) => stop.trigger.kill());
      material.dispose();
      texture.dispose();
    },
  };
}
