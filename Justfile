export TZ := "UTC"
TS_LOADER := " --import @swc-node/register/esm-register"
NODE_PARAMS := "--no-warnings " + TS_LOADER

_default:
    @just --list

server *node_args="":
    @node {{ NODE_PARAMS }} {{ node_args }} packages/server/main.ts --start

linter:
    @npx @biomejs/biome check

test *args="":
    @npx vitest run {{ args }}

test-watch *args="":
    @npx vitest watch {{ args }}

build-console:
    just _pre-build
    @rm -rf build/console
    @cd packages/console && npm run build

dev-console:
    just _pre-build
    @rm -rf build/console
    @cd packages/console && npm run build-watch

build-integration:
    @rm -rf plugins/tagoio-integration/build
    @cd plugins/tagoio-integration && npm run build

install:
    @npm install -g node-gyp
    @npm ci

########################### INFRA
# The process.env is not working on Vite Build
# This is a workaround to make it work

file_path := "./node_modules/@tago-io/sdk/lib/regions.js"

_pre-build:
    @sed -i'' -e 's/ process\.env\.TAGOIO_API/ window.process.env.TAGOIO_API/g' "{{ file_path }}"
    @sed -i'' -e 's/ process\.env\.TAGOIO_REALTIME/ window.process.env.TAGOIO_REALTIME/g' "{{ file_path }}"
    @sed -i'' -e 's/ process\.env\.TAGOIO_SSE/ window.process.env.TAGOIO_SSE/g' "{{ file_path }}"
    @echo "SDK patched"
