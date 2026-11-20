# Devesh — Portfolio

Run `npm install` and `npm run dev` to start Vite. Use `npm run lint` and `npm run build` to check the project, then `npm run preview` to serve the production build.

Edit portfolio copy, metadata and links in `src/content.json`. Vite renders the six templates in `src/sections/` into HTML before sending the page to the browser. Existing links to `#work` open Projects and links to `#projects` open Work Experience.

The browser entry is `src/main.js`. The GSAP ticker advances Lenis and draws the shared Three.js scene. A section can pass a group and optional `onEnter(group)`, `onLeave(group)`, `onProgress(progress, group)` and `dispose(group)` callbacks to the scene manager's `register(element, options)`. Use the shared loading manager for scene assets and release section-owned GPU resources in its dispose callback.

Apply `.light-panel` to give a section a light, rounded surface. The panel transition runs on fine pointers with motion enabled. Reduced-motion users get native scrolling, and the HTML remains usable without WebGL or JavaScript.

### Hero avatar

The hero uses the primitive bust in `src/three/avatar.js` until `public/models/avatar.glb` is present at Vite startup. To export a replacement, decimate the bust in Blender, apply its transforms, face +Z, then export as glTF Binary with Draco mesh compression enabled. Name the head pivot `Head` and the pupil nodes `Pupil_L` and `Pupil_R` for independent tracking. Use material colors or small embedded PNG, JPEG or WebP maps. Keep the file and the total decoded geometry and RGBA maps under 1,000,000 bytes. Restart Vite after adding the model.
