import react from "@vitejs/plugin-react-swc";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const filename = fileURLToPath(import.meta.url);
const buildPath = join(dirname(filename), "../../build");

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
  base: "/console",
  esbuild: {
    target: ["chrome58", "safari11"],
  },
  build: {
    minify: true,
    sourcemap: false,
    outDir: `${buildPath}/console`,
  },
});
