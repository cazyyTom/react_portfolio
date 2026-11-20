// Start tracking the renderer download without importing the renderer itself.
import { LoadingManager } from "three/src/loaders/LoadingManager.js";

export function createPreloader(progress) {
  const manager = new LoadingManager();
  manager.onStart = () => {
    progress.value = 0;
    progress.hidden = false;
  };
  manager.onProgress = (_, completed, total) => {
    progress.value = completed / total;
  };
  manager.onLoad = () => { progress.hidden = true; };

  async function track(key, promise) {
    manager.itemStart(key);
    try {
      return await promise;
    } catch (error) {
      manager.itemError(key);
      throw error;
    } finally {
      manager.itemEnd(key);
    }
  }

  return { manager, track };
}
