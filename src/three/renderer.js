import { WebGLRenderer } from "three";

export function createRenderer(canvas, camera) {
  const options = { alpha: true, antialias: true };
  const context = canvas.getContext("webgl2", options);
  if (!context) return null;

  const renderer = new WebGLRenderer({ canvas, context, ...options });
  renderer.setClearColor(0x000000, 0);
  let resolutionScale = 1;
  const pixelRatio = () => Math.min(window.devicePixelRatio || 1, 2) * resolutionScale;
  let needsRender = true;
  let lost = false;
  const onLost = () => { lost = true; };
  const onRestored = () => { lost = false; size(); };
  const size = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setDrawingBufferSize(width, height, pixelRatio());
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    needsRender = true;
  };
  size();
  const observer = new ResizeObserver(size);
  observer.observe(canvas);
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);

  return {
    contextLost: () => lost,
    invalidate() { needsRender = true; },
    setResolutionScale(scale) { resolutionScale = scale; },
    draw(scene, animated) {
      if (renderer.getPixelRatio() !== pixelRatio()) size();
      if (!needsRender && !animated) return;
      renderer.render(scene, camera);
      needsRender = false;
    },
    dispose() {
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      renderer.dispose();
    },
  };
}
