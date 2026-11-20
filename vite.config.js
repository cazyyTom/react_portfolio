import { defineConfig } from "vite";
import { avatarModelUrl } from "./build/avatar-model.js";
import content from "./src/content.json";
import { renderPage } from "./src/utils/page.js";

export default defineConfig({
  define: { __AVATAR_MODEL__: JSON.stringify(avatarModelUrl()) },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: "three-core", test: /three\/build\/three\.core\.js$/ }],
        },
      },
    },
  },
  plugins: [{
    name: "portfolio-html",
    transformIndexHtml: {
      order: "pre",
      handler(template) {
        const { meta, body } = renderPage(content);
        return template.replace("<!-- portfolio:meta -->", () => meta)
          .replace("<!-- portfolio:body -->", () => body);
      },
    },
  }],
});
