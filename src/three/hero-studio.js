import {
  CanvasTexture,
  DirectionalLight,
  EquirectangularReflectionMapping,
  HemisphereLight,
  SRGBColorSpace,
} from "three";

export function createStudio(group) {
  const environment = document.createElement("canvas");
  environment.width = 256;
  environment.height = 128;
  const ctx = environment.getContext("2d");
  const sky = ctx.createLinearGradient(0, 0, 0, 128);
  sky.addColorStop(0, "#747080");
  sky.addColorStop(0.56, "#3c3441");
  sky.addColorStop(1, "#16161a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 256, 128);
  for (const [x, y, w, h, color] of [
    [15, 18, 57, 64, "#fff6df"],
    [119, 24, 13, 62, "#e0d8ff"],
    [184, 13, 39, 27, "#b7d5ff"],
  ]) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }
  const texture = new CanvasTexture(environment);
  texture.mapping = EquirectangularReflectionMapping;
  texture.colorSpace = SRGBColorSpace;

  group.add(new HemisphereLight(0xffeee0, 0x7d668b, 1.05));
  for (const [color, intensity, x, y, z] of [
    [0xffe8ca, 2.3, -3, 5, 5],
    [0xb4caff, 1.05, 4, 1, 3],
    [0xf2c9ff, 3, 2, 3, -4],
  ]) {
    const light = new DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    group.add(light);
  }
  return texture;
}
