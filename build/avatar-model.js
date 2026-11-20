import { existsSync, readFileSync, statSync } from "node:fs";

// Decode dimensions from image headers without allocating the full texture.
function imagePixels(buffer, mime) {
  if (mime === "image/png")
    return buffer.readUInt32BE(16) * buffer.readUInt32BE(20);
  if (mime === "image/jpeg") {
    for (let offset = 2; offset + 9 < buffer.length;) {
      const marker = buffer.readUInt16BE(offset);
      if ([0xffc0, 0xffc1, 0xffc2].includes(marker)) {
        return (
          buffer.readUInt16BE(offset + 5) * buffer.readUInt16BE(offset + 7)
        );
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }
  if (mime === "image/webp") {
    switch (buffer.toString("ascii", 12, 16)) {
      case "VP8X":
        return (1 + buffer.readUIntLE(24, 3)) * (1 + buffer.readUIntLE(27, 3));
      case "VP8 ":
        return (
          (buffer.readUInt16LE(26) & 0x3fff) *
          (buffer.readUInt16LE(28) & 0x3fff)
        );
      case "VP8L": {
        const packed = buffer.readUInt32LE(21);
        return (1 + (packed & 0x3fff)) * (1 + ((packed >>> 14) & 0x3fff));
      }
    }
  }
  throw new Error("Could not determine decoded avatar texture dimensions");
}

// Check decoded sizes before advertising the self-contained GLB to the browser.
export function avatarModelUrl() {
  const file = new URL("../public/models/avatar.glb", import.meta.url);
  if (!existsSync(file)) return null;
  const budget = 1_000_000;
  if (statSync(file).size > budget)
    throw new Error("avatar.glb exceeds the 1 MB budget");
  const glb = readFileSync(file);
  const jsonEnd = 20 + glb.readUInt32LE(12);
  const data = JSON.parse(glb.subarray(20, jsonEnd).toString("utf8"));
  const components = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16,
  };
  const bytes = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };
  const geometryBytes = data.accessors.reduce(
    (total, a) => total + a.count * components[a.type] * bytes[a.componentType],
    0,
  );
  if (!Number.isFinite(geometryBytes) || data.buffers.some((b) => b.uri))
    throw new Error("Use an embedded avatar mesh");
  let decodedBytes = geometryBytes;
  for (const image of data.images ?? []) {
    if (image.bufferView == null)
      throw new Error(
        "Embed avatar textures in the GLB so their decoded size can be checked",
      );
    const view = data.bufferViews[image.bufferView];
    const start = jsonEnd + 8 + (view.byteOffset || 0);
    decodedBytes +=
      imagePixels(
        glb.subarray(start, start + view.byteLength),
        image.mimeType,
      ) * 4;
  }
  if (decodedBytes > budget)
    throw new Error("Decoded avatar geometry and maps exceed 1 MB");
  return "/models/avatar.glb";
}
