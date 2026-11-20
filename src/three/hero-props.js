import {
  Color,
  Group,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export async function createProps(stage, signal) {
  const group = new Group();
  const response = await fetch("/skill-icons.svg", { signal });
  if (!response.ok) throw new Error(response.statusText);
  const symbols = new DOMParser().parseFromString(
    await response.text(),
    "image/svg+xml",
  );
  const box = new RoundedBoxGeometry(1, 1, 0.27, 3, 0.16);
  const face = new PlaneGeometry(0.74, 0.74);
  const badges = [];
  for (const element of stage.querySelectorAll("[data-mark]")) {
    const symbol = symbols.getElementById(element.dataset.mark);
    const style = getComputedStyle(element);
    const ink = style.getPropertyValue("--ink").trim();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${symbol.getAttribute("viewBox")}" width="128" height="128" fill="${symbol.getAttribute("fill") || "currentColor"}" style="color:${ink}">${symbol.innerHTML}</svg>`;
    const image = new Image(128, 128);
    image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    await image.decode();
    const texture = new Texture(image);
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    const badge = new Mesh(
      box,
      new MeshStandardMaterial({
        color: style.getPropertyValue("--tile").trim(),
        metalness: 0.38,
        roughness: 0.23,
      }),
    );
    const mark = new Mesh(
      face,
      new MeshStandardMaterial({
        map: texture,
        transparent: true,
        roughness: 0.36,
      }),
    );
    mark.position.z = 0.141;
    badge.add(mark);
    badges.push({
      badge,
      element,
      angle: (parseFloat(style.getPropertyValue("--angle")) * Math.PI) / 180,
    });
    group.add(badge);
  }
  const beads = [
    [0.075, 0.7, 0.034, 1.3, 0xc1c3da],
    [0.895, 0.28, 0.03, 0.72, 0xcc976c],
    [0.335, 0.38, 0.019, 1.42, 0xe0bad7],
    [0.66, 0.65, 0.021, 1.12, 0xb5cbe0],
    [0.873, 0.84, 0.017, 1.54, 0xb5c4d4],
  ];
  const blobs = new InstancedMesh(
    new SphereGeometry(1, 24, 16),
    new MeshStandardMaterial({ metalness: 0.83, roughness: 0.17 }),
    beads.length,
  );
  blobs.frustumCulled = false;
  beads.forEach((bead, i) => blobs.setColorAt(i, new Color(bead[4])));
  group.add(blobs);
  const dummy = new Object3D();

  // Measurements are shared with the static composition and change only on resize.
  function measure(bounds) {
    for (const item of badges) {
      const rect = item.element.getBoundingClientRect();
      item.x = (rect.left + rect.width / 2 - bounds.left) / bounds.width;
      item.y = (rect.top + rect.height / 2 - bounds.top) / bounds.height;
      item.width = rect.width;
    }
  }
  function update(layout, time, exit, gaze) {
    function place(object, x, y, index, size) {
      const phase = index * 2.39;
      const rate = 0.45 + index * 0.087;
      const depth = 0.42 + (index % 4) * 0.17;
      const driftX =
        Math.cos(time * rate + phase) * 0.009 - gaze.x * 0.022 * depth;
      const driftY =
        Math.sin(time * rate + phase) * 0.019 + gaze.y * 0.033 * depth;
      layout.place(
        object,
        0.5 + (x - 0.5) * (1 + exit * 0.8) + driftX,
        y + (y - 0.48) * exit * 0.6 + driftY,
        -depth,
        size,
      );
      object.rotation.set(
        0.15 * Math.sin(time * rate + phase),
        0.3 * Math.cos(time * rate + phase),
        phase + 0.13 * Math.sin(time * rate + phase),
      );
    }
    badges.forEach(({ badge, x, y, angle, width }, i) => {
      place(badge, x, y, i, width);
      badge.rotation.z = angle + 0.14 * Math.sin(time * (0.46 + i * 0.07) + i);
    });
    beads.forEach(([x, y, size, stretch], i) => {
      place(
        dummy,
        x,
        y,
        i + badges.length,
        Math.min(layout.width, 1050) * size * 0.5,
      );
      dummy.scale.y *= stretch;
      dummy.scale.z *= 0.82;
      dummy.updateMatrix();
      blobs.setMatrixAt(i, dummy.matrix);
    });
    blobs.instanceMatrix.needsUpdate = true;
  }
  return { group, measure, update };
}
