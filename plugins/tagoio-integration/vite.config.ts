/// <reference types="vitest/config" />

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const configFilePath = fileURLToPath(import.meta.url);
const buildPath = join(dirname(configFilePath), "./build/front");

const TAGOIO_API = "https://api.tago.io";
const TAGOIO_REALTIME = "https://realtime.tago.io";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: { icon: true },
      include: ["**/*.svg", "**/*.svg?react"],
      exclude: [],
    }),
    react(),
  ],
  base: "/pages/tagoio-integration",
  esbuild: {
    target: ["chrome58", "safari11"],
  },
  build: {
    minify: true,
    sourcemap: false,
    outDir: buildPath,
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
  define: {
    "process.env.TAGOIO_API": `"${TAGOIO_API}"`,
    "process.env.TAGO_API": `"${TAGOIO_API}"`,
    "process.env.TAGOIO_REALTIME": `"${TAGOIO_REALTIME}"`,
    "process.env.TAGO_REALTIME": `"${TAGOIO_REALTIME}"`,
  },
});
