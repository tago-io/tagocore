import type { ZodError } from "zod";
import {
  zPluginModuleIDCombo,
  zPluginType,
  zPluginPublisher,
  zPluginInstallOptions,
  zPluginPermission,
  zPluginManifestCliOption,
  zPluginManifestCliCommand,
  zPluginPackageTCore,
  zPluginConfigField,
  zPluginStorageItemSet,
  zPluginModule,
  zPlugin,
  zModuleMessageOptions,
  zPluginModuleListItem,
  zPluginModuleList,
} from "./Plugin.types.ts";
import { test, expect, describe } from "vitest";

describe("zPluginModuleIDCombo", () => {
  test("valid id", () => {
    const data = "0810916b6ca256fb25afbe19b4f83b23:sample-action";
    const parsed = zPluginModuleIDCombo.parse(data);
    expect(parsed).toBe(data);
  });

  test("invalid id", () => {
    const data = "123:aaa";
    try {
      zPluginModuleIDCombo.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.formErrors[0]).toBe("Invalid Plugin ID");
    }
  });
});

describe("zPluginType", () => {
  test("invalid option", () => {
    const data = "a";
    try {
      zPluginType.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.formErrors[0].startsWith("Invalid enum value.")).toBeTruthy();
    }
  });
});

describe("zPluginPublisher", () => {
  test("check optional field", () => {
    const data = {
      name: "name",
    };
    const parsed = zPluginPublisher.parse(data);
    expect(parsed.domain).toBeUndefined();
  });
});

describe("zPluginInstallOptions", () => {
  test("accepts empty object", () => {
    const data = {};
    const parsed = zPluginInstallOptions.parse(data);
    expect(parsed.start).toBeUndefined();
    expect(parsed.log).toBeUndefined();
    expect(parsed.restoreBackup).toBeUndefined();
  });
});

describe("zPluginPermission", () => {
  test("invalid option", () => {
    const data = "a";
    try {
      zPluginPermission.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.formErrors[0].startsWith("Invalid enum value.")).toBeTruthy();
    }
  });
});

describe("zPluginManifestCliOption", () => {
  test("check optional field", () => {
    const data = {
      flags: "flags",
    };
    const parsed = zPluginManifestCliOption.parse(data);
    expect(parsed.description).toBeUndefined();
  });
});

describe("zPluginManifestCliCommand", () => {
  test("error if malformed array", () => {
    const data = {
      name: "name",
      arguments: [{ flags: 0 }],
      file: "file",
    };
    try {
      zPluginManifestCliCommand.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors).toStrictEqual({ arguments: ["Expected string, received number"] });
    }
  });
});

describe("zPluginPackageTCore", () => {
  test("error if malformed array", () => {
    const data = {
      name: "name",
      types: ["a"],
    };
    try {
      zPluginPackageTCore.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.types[0]).toContain("Invalid enum value.");
    }
  });
});

describe("zPluginConfigField", () => {
  test("invalid type", () => {
    const data = {};
    try {
      zPluginConfigField.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.formErrors[0]).toBe("Invalid input");
    }
  });
});

describe("zPluginStorageItemSet", () => {
  test("assure correct type", () => {
    const data = {
      value: 0,
      key: "key",
    };
    const parsed = zPluginStorageItemSet.parse(data);
    expect(parsed.type).toEqual("number");
  });
});

describe("zPluginModule", () => {
  test("invalid option", () => {
    const data = {
      state: "state",
      message: 0,
    };
    try {
      zPluginModule.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.state[0]).toContain("Invalid enum value.");
    }
  });
});

describe("zPlugin", () => {
  test("fail if missing required field", () => {
    const data = {};
    try {
      zPlugin.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.publisher).toStrictEqual(["Required"]);
    }
  });
});

describe("zModuleMessageOptions", () => {
  test("fail if missing required field", () => {
    const data = {};
    try {
      zModuleMessageOptions.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.message).toStrictEqual(["Required"]);
    }
  });
});

describe("zPluginModuleListItem", () => {
  test("check empty object", () => {
    const data = {
      pluginID: " ",
      pluginName: " ",
      setup: {},
    };
    try {
      zPluginModuleListItem.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors).toStrictEqual({ setup: ["Required", "Required", "Required"] });
    }
  });
});

describe("zPluginModuleList", () => {
  test("check empty array", () => {
    const data = [];
    try {
      zPluginModuleList.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      console.log(e);
      expect(e.formErrors).toStrictEqual({ setup: ["Required", "Required", "Required"] });
    }
  });
});
