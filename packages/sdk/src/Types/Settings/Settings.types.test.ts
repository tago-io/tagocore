import type { ZodError } from "zod";
import { zSettings, zSettingsEdit, zSettingsMetadata } from "./Settings.types.ts";
import { test, expect, describe } from "vitest";

describe("zSettings", () => {
  test("parses simple object", () => {
    const data = {
      custom_plugins: ["string"],
    };
    const parsed = zSettings.parse(data);
    expect(parsed.custom_plugins).toEqual(["string"]);
  });

  test("check default values for optional fields", () => {
    const data = {
      custom_plugins: ["string"],
    };
    const parsed = zSettings.parse(data);
    //expect(parsed.plugin_auto_update_check_time).toEqual(null);
    expect(parsed.port).toEqual(8888);
    //expect(parsed.telemetry).toEqual(false);
    expect(parsed.version).toBeUndefined();
  });
});

describe("zSettingsEdit", () => {
  test("parses simple object", () => {
    const data = {};
    const parsed = zSettingsEdit.parse(data);
    expect(parsed.custom_plugins).toBeUndefined();
  });
});

describe("zSettingsMetadata", () => {
  test("parses simple object", () => {
    const data = {
      database_plugin_disabled: true,
      plugin_folder_disabled: true,
      port_disabled: true,
    };
    const parsed = zSettingsMetadata.parse(data);
    expect(parsed.port_disabled).toBeTruthy();
  });

  test("check required field", () => {
    const data = {
      database_plugin_disabled: true,
      plugin_folder_disabled: true,
    };
    try {
      zSettingsMetadata.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.port_disabled[0]).toBe("Required");
    }
  });

  test("assure correct type", () => {
    const data = {
      database_plugin_disabled: true,
      plugin_folder_disabled: true,
      port_disabled: 0,
    };
    try {
      zSettingsMetadata.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.port_disabled[0]).toBe("Expected boolean, received number");
    }
  });
});
