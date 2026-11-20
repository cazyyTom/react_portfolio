import {
  CanvasTexture,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshMatcapMaterial,
  TorusGeometry,
  TorusKnotGeometry,
  SRGBColorSpace,
} from "three";

export function createAbout(element, engine, signal) {
  const group = new Group();
  const anchors = [...element.querySelectorAll(".about-stage i")];
  const palette = ["#bfc5de", "#ceb4d7", "#adaec1"];
  const geometries = [
    new TorusGeometry(0.65, 0.31, 20, 48),
    new TorusKnotGeometry(0.53, 0.2, 80, 12),
    new IcosahedronGeometry(0.93, 0),
  ];
  // A small studio matcap keeps the reflections independent of the Hero lights.
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 96;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createLinearGradient(12, 0, 76, 96);
  for (const [stop, color] of [
    [0, "#36323c"],
    [0.23, "#ffffff"],
    [0.34, "#ced3df"],
    [0.48, "#474354"],
    [0.57, "#29232d"],
    [0.73, "#faf6f2"],
    [1, "#554b69"],
  ])
    grad.addColorStop(stop, color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 96, 96);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const meshes = geometries.map(
    (geo, i) =>
      new Mesh(
        geo,
        new MeshMatcapMaterial({ matcap: texture, color: palette[i] }),
      ),
  );
  group.add(...meshes);
  let positions = [],
    x = 0,
    y = 0,
    t = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  function measure() {
    positions = anchors.map((el) => {
      const r = el.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + scrollY + r.height / 2, r.width];
    });
  }
  const observer = new ResizeObserver(measure);
  observer.observe(element);
  observer.observe(engine.canvas);
  element.addEventListener(
    "pointermove",
    (e) => {
      x = e.clientX / innerWidth - 0.5;
      y = e.clientY / innerHeight - 0.5;
    },
    { signal },
  );
  element.addEventListener(
    "pointerleave",
    () => {
      x = y = 0;
    },
    { signal },
  );
  measure();
  return {
    group,
    onEnter: measure,
    onFrame(_, ms) {
      const w = engine.canvas.clientWidth,
        h = engine.canvas.clientHeight;
      const scale =
        (2 *
          engine.camera.position.z *
          Math.tan((engine.camera.fov * Math.PI) / 360)) /
        h;
      const motion = reduced.matches ? 0 : 1;
      t += (Math.min(ms, 60) / 1000) * motion;
      meshes.forEach((m, i) => {
        const [cx, cy, size] = positions[i];
        m.scale.setScalar(size * 0.5 * scale);
        m.position.set(
          (cx - w / 2 + motion * x * (10 + i * 4)) * scale,
          (h / 2 -
            cy +
            scrollY +
            motion * (Math.sin(t * 0.8 + i) * 7 - y * 13)) *
            scale,
          0,
        );
        m.rotation.set(
          0.48 + i * 0.3 + motion * y * 0.15,
          0.3 + i + motion * (t * 0.15 + scrollY * 0.001 + x * 0.3),
          -0.48 + i * 0.7,
        );
      });
    },
    dispose() {
      observer.disconnect();
      texture.dispose();
      for (const m of meshes) {
        m.geometry.dispose();
        m.material.dispose();
      }
    },
  };
}
