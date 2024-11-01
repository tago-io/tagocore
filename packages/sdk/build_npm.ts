/*
 * Deno script, not used in production
 * */

// @ts-ignore Deno env
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: false,
  },
  package: {
    name: "@tago-io/tcore-sdk",
    version: "0.7.0",
    description: "TCore SDK for creating plugins",
    author: "Tago LLC",
    homepage: "https://github.com/tago-io/tcore",
    repository: {
      type: "git",
      url: "https://github.com/tago-io/tcore",
    },
  },
  // postBuild() {
  //   Deno.copyFileSync("LICENSE", "npm/LICENSE");
  //   Deno.copyFileSync("README.md", "npm/README.md");
  // },
});
