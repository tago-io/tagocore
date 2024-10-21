export TZ := "UTC"
TS_LOADER := " --import @swc-node/register/esm-register"
NODE_PARAMS := "--no-warnings " + TS_LOADER

_default:
  @just --list

server *node_args="":
  @node {{NODE_PARAMS}} {{node_args}} packages/server/main.ts --start

linter:
  @npx @biomejs/biome check

build-console:
  just _pre-build
  @rm -rf build/console
  @cd packages/console && npm run build


########################### INFRA

# The process.env is not working on Vite Build
# This is a workaround to make it work
file_path := "./node_modules/@tago-io/sdk/out/regions.js"
_pre-build:
  @sed -i'' -e 's/ process\.env\.TAGOIO_API/ window.process.env.TAGOIO_API/g' "{{file_path}}"
  @sed -i'' -e 's/ process\.env\.TAGOIO_REALTIME/ window.process.env.TAGOIO_REALTIME/g' "{{file_path}}"
  @echo "SDK patched"
