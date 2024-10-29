/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react-swc";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const configFilePath = fileURLToPath(import.meta.url);
const buildPath = join(dirname(configFilePath), "./build/front");

const TAGOIO_API = "https://api.tago.io";
const TAGOIO_REALTIME = "https://realtime.tago.io";

//  FIXME:(klaus) external dep 'path'? 'eventsource'?
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
  //  FIXME::(klaus) test it
  base: "/pages/tagoio-integration",
  esbuild: {
    target: ["chrome58", "safari11"],
  },
  build: {
    minify: true,
    sourcemap: false,
    //  FIXME:(klaus) ./build/front/index.js ?
    //  FIXME:(klaus) ./build/front/index.html ?
    outDir: buildPath,
  },
  //  FIXME:(klaus) see what tests this has, fix config if needed
  test: {
    environment: "jsdom",
    globals: true,
    // setupFiles: ["./utils/setup-tests.ts"],
  },
  define: {
    "process.env.TAGOIO_API": `"${TAGOIO_API}"`,
    "process.env.TAGO_API": `"${TAGOIO_API}"`,
    "process.env.TAGOIO_REALTIME": `"${TAGOIO_REALTIME}"`,
    "process.env.TAGO_REALTIME": `"${TAGOIO_REALTIME}"`,
  },
});
