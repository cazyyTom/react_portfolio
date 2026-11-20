import { Box3, Group, Vector3 } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import decoderJS from "three/addons/libs/draco/gltf/draco_wasm_wrapper.js?url";
import decoderWasm from "three/addons/libs/draco/gltf/draco_decoder.wasm?url";

export async function loadAvatar(url, manager) {
  const decoder = new DRACOLoader(manager).setDecoderPath({
    js: decoderJS,
    wasm: decoderWasm,
  });
  const loader = new GLTFLoader(manager).setDRACOLoader(decoder);
  let model;
  try {
    ({ scene: model } = await loader.loadAsync(url));
  } finally {
    decoder.dispose();
  }
  const bounds = new Box3().setFromObject(model);
  const center = bounds.getCenter(new Vector3());
  const scale = 3.1 / bounds.getSize(new Vector3()).y;
  const normalized = new Group();
  normalized.scale.setScalar(scale);
  normalized.position.copy(center).multiplyScalar(-scale);
  normalized.add(model);
  const bust = new Group();
  bust.add(normalized);
  const head = model.getObjectByName("Head") || model;
  const pupils = ["Pupil_L", "Pupil_R"]
    .map((name) => model.getObjectByName(name))
    .filter(Boolean);
  for (const pupil of pupils) {
    pupil.userData.restX = pupil.position.x;
    pupil.userData.restY = pupil.position.y;
  }
  return {
    bust,
    head,
    pupils,
    restYaw: head.rotation.y,
    restPitch: head.rotation.x,
  };
}
