import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, expect, test, vi } from "vitest";
import { plugins } from "../Host.ts";
import type Module from "../Module/Module.ts";
import Validator from "../Validator/Validator.ts";
import { callbackInterval } from "../Worker/Worker.ts";
import Plugin from "./Plugin.ts";
const __filename = fileURLToPath(import.meta.url);
const dirname__ = dirname(__filename);

afterAll(() => {
  if (callbackInterval) {
    clearInterval(callbackInterval);
  }
});

test("throws error if package is not found", () => {
  const folder = dirname__;
  const msg = "Unable to load plugin package.json";
  expect(() => new Plugin(folder)).toThrowError(msg);
});

//TODO FIX
// test("calls Validator.validatePackageJSON", async () => {
//   const fn = vi.spyOn(Validator.prototype, "validatePackageJSON");
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin4");
//   const plugin = new Plugin(folder);
//   await plugin.start();
//   expect(fn).toHaveBeenCalled();
//   await plugin.stop(true).catch(() => null);
// });

test("sets properties correctly", () => {
  const folder = path.join(dirname__, "..", "__mocks__", "plugin2");
  const plugin = new Plugin(folder);
  expect(plugin.description).toEqual("Description of plugin2");
  expect(plugin.id).toEqual("27eea77f2d965a9a9d91db45b35d2aa9");
  expect(plugin.packageName).toEqual("@tago-io/mock-plugin-2");
  expect(plugin.package.tcore.permissions).toEqual([
    "device",
    "action",
    "analysis",
    "device-data",
  ]);
  expect(plugin.types).toEqual(["service"]);
  expect(plugin.tcoreName).toEqual("Plugin 2");
  expect(plugin.version).toEqual("0.0.1");
  expect(plugin.error).toEqual(null);
});

test("loads full_description correctly", () => {
  const folder = path.join(dirname__, "..", "__mocks__", "plugin3");
  const plugin = new Plugin(folder);
  expect(plugin.fullDescription).toEqual("# Hello World\n");
});

test("throws error if full_description file doesn't exist", () => {
  const folder = path.join(dirname__, "..", "__mocks__", "plugin8");
  expect(() => new Plugin(folder)).toThrowError(/ENOENT/g);
});

test("has correct initial state", () => {
  const folder = path.join(dirname__, "..", "__mocks__", "plugin3");
  const plugin = new Plugin(folder);
  expect(plugin.state).toEqual("idle");
});

//TODO FIX
// test("starts a simple plugin", async () => {
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin4");
//   const plugin = new Plugin(folder);
//   await plugin.start();
//   expect(plugin.state).toEqual("started");
//   expect(plugin.error).toEqual(null);
//   expect(plugin.modules.size).toEqual(1);

//   const module = plugin.modules.values().next().value;
//   expect(module.error).toBeNull();
//   expect(module.id).toEqual("hello");
//   expect(module.message).toBeNull();
//   expect(module.name).toEqual("world");
//   expect(module.state).toEqual("started");

//   await plugin.stop(true);
// });

//TODO FIX
// test("throws when attempting to start an already started plugin", async () => {
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin4");
//   const plugin = new Plugin(folder);
//   await plugin.start();
//   try {
//     await plugin.start();
//   } catch (ex: any) {
//     expect(ex.message).toEqual("Plugin already started");
//   } finally {
//     await plugin.stop(true);
//   }
// });

//TODO FIX
// test("gracefully stops a simple plugin", async () => {
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin4");
//   const plugin = new Plugin(folder);
//   await plugin.start();
//   await plugin.stop();
//   expect(plugin.modules.size).toEqual(1);

//   const module = plugin.modules.values().next().value;
//   expect(plugin.state).toEqual("stopped");
//   expect(module.state).toEqual("stopped");

//   await plugin.stop(true).catch(() => null);
// });

test("loads a plugin that has just an error", async () => {
  const folder = path.join(dirname__, "..", "__mocks__", "plugin5");
  const plugin = new Plugin(folder);
  const error = "Invalid database port";
  await plugin.start().catch((e) => expect(e.message).toEqual(error));

  expect(plugin.error).toEqual(error);
  expect(plugin.state).toEqual("stopped");
  expect(plugin.modules.size).toEqual(0);

  await plugin.stop(true).catch(() => null);
});

//TODO FIX
// test("loads a plugin that has an error after a module definition", async () => {
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin6");
//   const plugin = new Plugin(folder);
//   const error = "Invalid database port";
//   await plugin.start().catch((e) => expect(e.message).toEqual(error));

//   expect(plugin.modules.size).toEqual(1);

//   const module = plugin.modules.values().next().value;
//   expect(module.error).toBeNull();
//   expect(module.id).toEqual("hello");
//   expect(module.message).toBeNull();
//   expect(module.name).toEqual("world");
//   expect(module.state).toEqual("stopped");

//   await plugin.stop(true).catch(() => null);
// });

//TODO FIX
// test("loads a plugin that has an error in a module.onLoad call", async () => {
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin9");
//   const plugin = new Plugin(folder);
//   await plugin.start();

//   expect(plugin.modules.size).toEqual(1);

//   const module = plugin.modules.values().next().value;
//   expect(module.error).toEqual("Invalid database port");
//   expect(module.id).toEqual("hello");
//   expect(module.message).toBeNull();
//   expect(module.name).toEqual("world");
//   expect(module.state).toEqual("stopped");

//   await plugin.stop(true);
// });

//TODO FIX
// test("only returns after all modules were loaded", async () => {
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin10");
//   const plugin = new Plugin(folder);
//   await plugin.start();

//   expect(plugin.modules.size).toEqual(2);

//   const modules = [...plugin.modules.values()];
//   expect(modules[0].error).toBeNull();
//   expect(modules[0].id).toEqual("service1");
//   expect(modules[0].message).toBeNull();
//   expect(modules[0].name).toEqual("Service 1");
//   expect(modules[0].state).toEqual("started");

//   expect(modules[1].error).toEqual("Error in service2");
//   expect(modules[1].id).toEqual("service2");
//   expect(modules[1].message).toBeNull();
//   expect(modules[1].name).toEqual("Service 2");
//   expect(modules[1].state).toEqual("stopped");

//   await plugin.stop(true);
// });

//TODO FIX
// test("stops plugin execution without waiting for onDestroy", async () => {
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin11");
//   const plugin = new Plugin(folder);
//   await plugin.start();

//   const timestamp = Date.now();
//   await plugin.stop(true);

//   expect(Date.now() - timestamp).toBeLessThan(1000);

//   const modules = [...plugin.modules.values()];
//   expect(modules).toHaveLength(1);
//   expect(modules[0].error).toBeNull();
//   expect(modules[0].id).toEqual("service1");
//   expect(modules[0].message).toBeNull();
//   expect(modules[0].name).toEqual("Service 1");
//   expect(modules[0].state).toEqual("stopped");
// });

//TODO FIX
// test("stops plugin execution waiting for onDestroy", async () => {
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin11");
//   const plugin = new Plugin(folder);
//   await plugin.start();

//   const timestamp = Date.now();
//   await plugin.stop();

//   expect(Date.now() - timestamp).toBeGreaterThan(2000);

//   const modules = [...plugin.modules.values()];
//   expect(modules).toHaveLength(1);
//   expect(modules[0].error).toBeNull();
//   expect(modules[0].id).toEqual("service1");
//   expect(modules[0].message).toBeNull();
//   expect(modules[0].name).toEqual("Service 1");
//   expect(modules[0].state).toEqual("stopped");
// });

//TODO FIX
// test("sets message property of module correctly", async () => {
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin12");
//   const plugin = new Plugin(folder);
//   plugins.set(plugin.id, plugin);
//   await plugin.start();

//   const module = plugin.modules.get("service1") as Module;
//   expect(module.message).not.toBeNull();
//   expect(module.message.icon).toEqual("exclamation-circle");
//   expect(module.message.message).toEqual("Hello world");

//   await plugin.stop(true);
// });

//TODO FIX
// test("shuts down plugin when disabling it", async () => {
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin12");
//   const plugin = new Plugin(folder);
//   await plugin.start();
//   await plugin.disable();

//   expect(plugin.error).toBeNull();
//   expect(plugin.state).toEqual("disabled");

//   const module = plugin.modules.get("service1") as Module;
//   expect(module.error).toBeNull();
//   expect(module.state).toEqual("stopped");
// });

test("removes error when disabling plugin", async () => {
  const folder = path.join(dirname__, "..", "__mocks__", "plugin5");
  const plugin = new Plugin(folder);
  await plugin.start().catch(() => null);

  expect(plugin.error).toEqual("Invalid database port");
  expect(plugin.state).toEqual("stopped");

  await plugin.disable();

  expect(plugin.error).toBeNull();
});

//TODO FIX
// test("ignores disable if already disabled", async () => {
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin12");
//   const plugin = new Plugin(folder);
//   await plugin.start();
//   await plugin.disable();

//   plugin.error = "not_null_because_it_wasn't_reset";
//   await plugin.disable();

//   expect(plugin.error).toEqual("not_null_because_it_wasn't_reset");
// });

//TODO FIX
// test("starts plugin when enabling it", async () => {
//   const folder = path.join(dirname__, "..", "__mocks__", "plugin12");
//   const plugin = new Plugin(folder);
//   await plugin.start();
//   await plugin.disable();
//   await plugin.enable();

//   expect(plugin.error).toBeNull();
//   expect(plugin.state).toEqual("started");

//   const module = plugin.modules.get("service1") as Module;
//   expect(module.error).toBeNull();
//   expect(module.state).toEqual("started");

//   await plugin.stop(true);
// });
