import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["json-summary"],
      exclude: ["node_modules/", "dist/"],
    },
  },
});
