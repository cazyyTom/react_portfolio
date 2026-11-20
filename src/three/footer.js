import {
  CanvasTexture,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshMatcapMaterial,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
} from "three";
import { Font } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import typeface from "../assets/footer-typeface.json";

function studioReflection() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const light = ctx.createLinearGradient(18, 0, 96, 128);
  for (const [stop, color] of [
    [0, "#9f9aa7"],
    [0.16, "#ffffff"],
    [0.38, "#d7d1df"],
    [0.53, "#8c8099"],
    [0.57, "#706977"],
    [0.8, "#e8e6ed"],
    [1, "#928595"],
  ])
    light.addColorStop(stop, color);
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, 128, 128);
  const highlight = ctx.createRadialGradient(38, 28, 1, 39, 28, 23);
  highlight.addColorStop(0, "white");
  highlight.addColorStop(1, "#ffffff00");
  ctx.fillStyle = highlight;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function lightning() {
  const outline = [
    [0.06, 0.95],
    [-0.66, -0.13],
    [-0.1, -0.13],
    [-0.36, -0.99],
    [0.72, 0.29],
    [0.17, 0.29],
    [0.53, 0.95],
  ];
  const shape = new Shape(outline.map(([x, y]) => new Vector2(x, y)));
  return new ExtrudeGeometry(shape, {
    depth: 0.22,
    bevelThickness: 0.055,
    bevelSize: 0.055,
    bevelSegments: 2,
  });
}

function buildName(name, material, edge) {
  const font = new Font(typeface);
  const word = new Group();
  let width = 0;
  for (const char of name) {
    const glyph = typeface.glyphs[char];
    if (!glyph) break;
    const geometry = new TextGeometry(char, {
      font,
      size: 1,
      depth: 0.105,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.009,
      bevelSegments: 1,
    });
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const x = (box.min.x + box.max.x) / 2,
      y = (box.min.y + box.max.y) / 2;
    geometry.translate(-x, -y, -0.05);
    const letter = new Mesh(geometry, [material, edge]);
    letter.position.x = width + x;
    letter.userData.baseline = y - 0.365;
    word.add(letter);
    width += glyph.ha / typeface.resolution;
  }
  for (const letter of word.children) letter.position.x -= width / 2;
  return { word, width };
}

export function createFooter(element, engine, signal) {
  const group = new Group();
  const reflection = studioReflection();
  const materials = [];
  function enamel(color) {
    const material = new MeshMatcapMaterial({ color, matcap: reflection });
    materials.push(material);
    return material;
  }
  const name = element.querySelector(".contact-name");
  const text = name.textContent.trim().toUpperCase();
  const { word, width: wordWidth } = buildName(
    text,
    enamel("#f5eefe"),
    enamel("#a584bf"),
  );
  const hasName =
    word.children.length === Array.from(text).length && wordWidth > 0;
  group.add(word);
  word.visible = hasName;
  const art = element.querySelector(".contact-art");
  const geometry = [
    lightning(),
    new TorusGeometry(0.69, 0.24, 12, 34),
    new SphereGeometry(0.84, 18, 12),
  ];
  const colors = ["#ffc365", "#ce99f8", "#83e5d0"];
  const props = [...art.querySelectorAll(".contact-prop")].map((target, i) => {
    const mesh = new Mesh(geometry[i], enamel(colors[i]));
    group.add(mesh);
    return {
      mesh,
      target,
      offset: new Vector2(),
      velocity: new Vector2(),
      anchor: new Vector2(),
      radius: 0,
    };
  });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = new Vector2(-10000, -10000),
    tilt = new Vector2(),
    aim = new Vector2();
  let drag = null,
    pointerId = null,
    pointerTime = 0;
  let worldPerPixel,
    viewW,
    viewH,
    nameX,
    nameY,
    nameSize,
    time = 0,
    drop = 0,
    dirty = true,
    lastY;
  // Keep the DOM sharp on fill-rate-limited devices. Sample sustained active
  // frames and lower only the shared canvas resolution while this footer is live.
  let composite = false;
  let needsClear = false;
  const label = name.firstElementChild;
  const originalName = label.textContent;
  let faces = [];
  function enableCompositor() {
    composite = true;
    needsClear = true;
    word.visible = false;
    props.forEach(({ mesh }) => {
      mesh.visible = false;
    });
    if (hasName) {
      faces = Array.from(originalName, (char) => {
        const face = document.createElement("b");
        face.textContent = char;
        return face;
      });
      label.replaceChildren(...faces);
      name.setAttribute("aria-label", originalName);
    }
    element.classList.add("footer-composited");
  }
  let sampleMs = 0,
    sampleFrames = 0,
    resolutionScale = 1;
  function samplePerformance(ms) {
    if (ms > 150 || composite) return;
    sampleMs += ms;
    sampleFrames++;
    if (sampleMs < 500) return;
    if (sampleMs / sampleFrames > 20) {
      if (resolutionScale <= 0.5) enableCompositor();
      else {
        resolutionScale = Math.max(0.5, resolutionScale * 0.78);
        engine.setResolutionScale(resolutionScale);
      }
    }
    sampleMs = sampleFrames = 0;
  }
  function measure() {
    viewW = engine.canvas.clientWidth;
    viewH = engine.canvas.clientHeight;
    worldPerPixel =
      (2 *
        engine.camera.position.z *
        Math.tan((engine.camera.fov * Math.PI) / 360)) /
      viewH;
    const rect = name.getBoundingClientRect();
    nameX = rect.left + rect.width / 2;
    nameY = rect.top + scrollY + rect.height / 2;
    nameSize = Math.min(
      rect.width / Math.max(1, wordWidth),
      rect.height / 0.92,
    );
    const zone = art.getBoundingClientRect();
    for (const prop of props) {
      const { target } = prop;
      prop.radius = target.offsetWidth / 2;
      prop.anchor.set(
        zone.left + target.offsetLeft + prop.radius,
        zone.top + scrollY + target.offsetTop + prop.radius,
      );
    }
    dirty = true;
  }
  const observer = new ResizeObserver(measure);
  for (const item of [element, art, name, engine.canvas])
    observer.observe(item);
  function move(event) {
    if (reduced.matches || (drag && event.pointerId !== pointerId)) return;
    if (drag) {
      const dx = event.clientX - pointer.x,
        dy = event.clientY - pointer.y;
      const dt = Math.max(0.012, (event.timeStamp - pointerTime) / 1000);
      drag.offset.x += dx;
      drag.offset.y += dy;
      drag.offset.clampLength(0, drag.radius * 1.35);
      drag.velocity.set(dx / dt, dy / dt).clampLength(0, 690);
    }
    pointer.set(event.clientX, event.clientY);
    aim.set((pointer.x / viewW) * 2 - 1, 1 - (pointer.y / viewH) * 2);
    pointerTime = event.timeStamp;
  }
  element.addEventListener("pointermove", move, { signal });
  art.addEventListener(
    "pointerdown",
    (event) => {
      if (reduced.matches || !event.isPrimary || event.button !== 0) return;
      const prop = props.find((p) => p.target === event.target);
      if (!prop) return;
      move(event);
      drag = prop;
      pointerId = event.pointerId;
      prop.velocity.set(0, 0);
      prop.target.setPointerCapture(pointerId);
    },
    { signal },
  );
  function release(event) {
    if (pointerId !== event.pointerId) return;
    if (event.timeStamp - pointerTime > 110 || event.type === "pointercancel")
      drag.velocity.set(0, 0);
    drag = null;
    pointerId = null;
    pointer.set(-10000, -10000);
  }
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
    art.addEventListener(type, release, { signal });
  element.addEventListener(
    "pointerleave",
    () => {
      if (!drag) pointer.set(-10000, -10000);
      aim.set(0, 0);
    },
    { signal },
  );
  function restoreHTML() {
    element.classList.remove("footer-live", "name-live");
  }
  engine.canvas.addEventListener("webglcontextlost", restoreHTML, { signal });
  engine.canvas.addEventListener("webglcontextrestored", measure, { signal });
  reduced.addEventListener(
    "change",
    () => {
      dirty = true;
    },
    { signal },
  );
  measure();

  function place(object, x, y, scale) {
    object.position.set(
      (x - viewW / 2) * worldPerPixel,
      (viewH / 2 - y) * worldPerPixel,
      0,
    );
    object.scale.setScalar(scale * worldPerPixel);
  }
  return {
    group,
    onEnter() {
      engine.setResolutionScale(resolutionScale);
      drop = 0;
      measure();
    },
    onLeave() {
      engine.setResolutionScale(1);
      sampleMs = sampleFrames = 0;
      restoreHTML();
      drag = null;
      pointerId = null;
      aim.set(0, 0);
      pointer.set(-10000, -10000);
    },
    onFrame(_, ms) {
      const still = reduced.matches;
      const y = scrollY;
      if (still && !dirty && lastY === y) return false;
      dirty = false;
      lastY = y;
      if (!still) samplePerformance(ms);
      const dt = Math.min(ms / 1000, 0.033);
      if (!still) time += dt;
      tilt.lerp(aim, 1 - Math.exp(-dt * 7));
      props.forEach((prop, i) => {
        const { offset, velocity, radius, anchor, mesh, target } = prop;
        const dx = anchor.x + offset.x - pointer.x,
          dy = anchor.y - y + offset.y - pointer.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        if (still) {
          offset.set(0, 0);
          velocity.set(0, 0);
        } else if (prop !== drag) {
          const repel = Math.max(0, 1 - distance / (radius + 85)) * 720;
          velocity.x +=
            ((dx / distance) * repel - 21 * offset.x - 5 * velocity.x) * dt;
          velocity.y +=
            ((dy / distance) * repel - 21 * offset.y - 5 * velocity.y) * dt;
          offset.addScaledVector(velocity, dt).clampLength(0, radius * 1.55);
        }
        const bob = still ? 0 : Math.sin(time * (0.8 + i * 0.13) + i) * 5;
        place(mesh, anchor.x + offset.x, anchor.y - y + offset.y + bob, radius);
        mesh.rotation.set(
          i === 1 ? 0.93 : 0.1,
          i === 0 ? -0.33 : 0.28,
          [-0.18, 0.49, 0.28][i] +
            (still ? 0 : Math.sin(time * 0.75 + i) * 0.09) +
            offset.x * 0.006,
        );
        if (i === 2) mesh.scale.y *= 1.26;
        target.style.transform = `translate3d(${offset.x}px,${offset.y + bob}px,0)`;
      });
      place(word, nameX, nameY - y, nameSize);
      if (nameY - y - nameSize * 0.4 < viewH) drop += dt;
      word.children.forEach((letter, i) => {
        const phase = Math.max(0, drop - i * 0.055);
        const bounce = still
          ? 0
          : 0.56 * Math.exp(-phase * 5) * Math.cos(phase * 11);
        letter.position.y = letter.userData.baseline + bounce;
        letter.rotation.set(
          still ? 0 : -tilt.y * 0.12,
          still ? -0.05 : tilt.x * 0.16 - 0.05,
          still ? 0 : bounce * 0.12,
        );
      });
      if (composite && hasName) {
        word.children.forEach((letter, i) => {
          const lift =
            (letter.userData.baseline - letter.position.y) * nameSize;
          faces[i].style.transform =
            `perspective(600px) translateY(${lift}px) rotateY(${letter.rotation.y}rad) rotateX(${letter.rotation.x}rad)`;
        });
      }
      if (!element.classList.contains("footer-live")) {
        element.classList.add("footer-live");
        element.classList.toggle("name-live", hasName);
      }
      const draw = !composite || needsClear;
      needsClear = false;
      return draw;
    },
    dispose() {
      engine.setResolutionScale(1);
      restoreHTML();
      observer.disconnect();
      element.classList.remove("footer-composited");
      label.textContent = originalName;
      name.removeAttribute("aria-label");
      props.forEach(({ target }) => target.style.removeProperty("transform"));
      group.traverse((obj) => obj.geometry?.dispose());
      materials.forEach((mat) => mat.dispose());
      reflection.dispose();
    },
  };
}
