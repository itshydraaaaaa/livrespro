import { defineConfig } from "vitest/config";
import path from "path";

const rootDir = path.resolve(import.meta.dirname);

export default defineConfig({
  root: rootDir,
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "client", "src"),
      "@shared": path.resolve(rootDir, "shared"),
      "@assets": path.resolve(rootDir, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    environmentMatchGlobs: [
      ["client/src/**/*.test.tsx", "jsdom"],
      ["client/src/**/*.test.ts", "jsdom"],
    ],
    setupFiles: ["client/src/test/setup.ts"],
    include: [
      "server/**/*.test.ts",
      "server/**/*.spec.ts",
      "client/src/**/*.test.ts",
      "client/src/**/*.spec.ts",
      "client/src/**/*.test.tsx",
      "client/src/**/*.spec.tsx",
    ],
  },
});
