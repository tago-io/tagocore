const svgr = require("./svgr.js");
const esbuild = require("esbuild");
const fs = require("node:fs");

const dev = process.argv.includes("--watch");

const TAGOIO_API = "https://api.tago.io";
const TAGOIO_REALTIME = "https://realtime.tago.io";

/**
 */
async function buildFront() {
  await esbuild.build({
    entryPoints: ["./src/front/index.tsx"],
    bundle: true,
    charset: "utf8",
    outfile: "./build/front/index.js",
    target: ["chrome58", "safari11"],
    inject: ["./esbuild/react-shim.js", "./esbuild/dirname-shim.js"],
    minify: !dev,
    publicPath: "/pages/tagoio-integration",
    sourcemap: dev,
    watch: dev,
    external: ["path"],
    plugins: [svgr()],
    define: {
      "process.env.TAGOIO_API": `"${TAGOIO_API}"`,
      "process.env.TAGO_API": `"${TAGOIO_API}"`,
      "process.env.TAGOIO_REALTIME": `"${TAGOIO_REALTIME}"`,
      "process.env.TAGO_REALTIME": `"${TAGOIO_REALTIME}"`,
    },
    loader: {
      ".png": "file",
    },
  });
}

/**
 */
async function generateHTML() {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <div id="root"></div>
      <script src="/pages/tagoio-integration/index.js"></script>
    </body>
    </html>
  `;

  fs.writeFileSync("./build/front/index.html", template, { encoding: "utf-8" });
}

/**
 */
async function build() {
  await fs.promises.rm("./build", { recursive: true }).catch(() => null);
  await Promise.all([await buildFront(), await generateHTML()]);
}

build();
