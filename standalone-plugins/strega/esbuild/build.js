const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const buildPath = path.join(__dirname, "../build");

try {
  fs.rmSync(buildPath, { recursive: true });
} catch (ex) {
  //
}

const dev = process.argv.includes("--watch");

console.log("Starting esbuild...");

esbuild
  .build({
    entryPoints: ["./src/index.js"],
    bundle: true,
    outfile: `${buildPath}/index.js`,
    target: ["node14"],
    platform: 'node',
    absWorkingDir: path.join(__dirname, "../"),
    minify: !dev,
    sourcemap: dev,
    watch: dev ? { onRebuild: () => console.log("Rebuilding...") } : false,
  })
  .catch(console.log);
