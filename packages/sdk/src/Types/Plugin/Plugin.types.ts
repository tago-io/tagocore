/* eslint-disable no-unused-vars */
import { z } from "zod";
import { zIcon } from "../Common/Icon.types.ts";

/**
 * Validation for a combo of PluginID and ModuleID, such as:
 * `0810916b6ca256fb25afbe19b4f83b23:sample-action`
 */
export const zPluginModuleIDCombo = z
  .string()
  .refine((x) => {
    const split = x.split(":");
    return split[0].length === 32;
  }, "Invalid Plugin ID")
  .refine((x) => {
    const split = x.split(":");
    return split[1];
  }, "Invalid Module ID");

/**
 * Types of plugins available.
 */
export const zPluginType = z.enum([
  "action-trigger",
  "action-type",
  "database",
  "queue",
  "decoder",
  "encoder",
  "filesystem",
  "hook",
  "navbar-button",
  "page",
  "service",
  "sidebar-button",
  "sidebar-footer-button",
  "system-override",
  "default",
]);

/**
 * Publisher information of a plugin.
 */
export const zPluginPublisher = z.object({
  name: z.string(),
  domain: z.string().nullish(),
});

/**
 * Configuration for when installing plugins.
 */
export const zPluginInstallOptions = z.object({
  start: z.boolean().optional(),
  log: z.boolean().optional(),
  restoreBackup: z.boolean().optional(),
});

/**
 * Types of permissions available.
 */
export const zPluginPermission = z.enum([
  "device",
  "analysis",
  "action",
  "device-data",
  "cli",
  "plugin",
]);

/**
 */
export const zPluginManifestCliOption = z.object({
  flags: z.string(),
  description: z.string().nullish(),
});

/**
 */
export const zPluginManifestCliCommand = z.object({
  name: z.string(),
  description: z.string().nullish(),
  arguments: z.array(zPluginManifestCliOption).nullish(),
  options: z.array(zPluginManifestCliOption).nullish(),
  file: z.string(),
});

/**
 * Configuration of the `tcore` object in the package.json files of plugins.
 */
export const zPluginPackageTCore = z.object({
  name: z.string(),
  description: z.string().optional(),
  full_description: z.string().nullish(),
  icon: z.string().optional(),
  screenshots: z.array(z.string()).optional(),
  types: z.array(zPluginType),
  permissions: z.array(zPluginPermission).nullish(),
  cli_commands: z.array(zPluginManifestCliCommand).nullish(),
});

/**
 * Configuration of a log channel of a plugin.
 */
const zPluginLogChannel = z.object({
  name: z.string(),
  channel: z.string(),
  plugin: z.boolean(),
});

/**
 * Configuration of a plugin class item in a list.
 */
const zPluginClassListItem = z.object({
  pluginID: z.string(),
  pluginName: z.string(),
  setupID: z.string(),
  setupName: z.string(),
});

/**
 * Configuration of a button in the plugin list ite.
 */
const zPluginListItemButton = z.object({
  color: z.string(),
  icon: zIcon,
  name: z.string(),
  route: z.string(),
  type: z.enum(["sidebar-button", "navbar-button"]),
});

/**
 * Configuration of visibility condition.
 */
const zPluginConfigVisibilityCondition = z.object({
  condition: z.enum(["", "!", "<", ">", "=", "><", "*", "ne"]),
  field: z.string(),
  value: z.any(),
  valueTwo: z.any().nullish(),
});

/**
 * A single configuration field of a plugin.
 */
const zGenericConfigField = z.object({
  defaultValue: z.any(),
  field: z.string(),
  icon: zIcon.nullish(),
  name: z.string().nullish(),
  placeholder: z.string().nullish(),
  required: z.boolean().nullish(),
  tooltip: z.string().nullish(),
  type: z.string(),
  visibility_conditions: z.array(zPluginConfigVisibilityCondition).nullish(),
});

/**
 * The configuration for a basic option field (label and value).
 */
const zBasicOption = z.object({
  label: z.string(),
  value: z.string(),
});

/**
 * The configuration for a "option" field.
 */
const zPluginConfigFieldOption = zGenericConfigField.extend({
  type: z.literal("option"),
  options: z.array(zBasicOption),
});

/**
 * The configuration for a "string" field.
 */
const zPluginConfigFieldString = zGenericConfigField.extend({
  type: z.literal("string"),
  defaultValue: z.string().nullish(),
});

/**
 * The configuration for a "number" field.
 */
const zPluginConfigFieldNumber = zGenericConfigField.extend({
  type: z.literal("number"),
  defaultValue: z.number().nullish(),
  min: z.number().nullish(),
  max: z.number().nullish(),
});

/**
 * The configuration for a "password" field.
 */
const zPluginConfigFieldPassword = zGenericConfigField.extend({
  type: z.literal("password"),
  defaultValue: z.string().nullish(),
});

/**
 * The configuration for a "boolean" field.
 */
const zPluginConfigFieldBoolean = zGenericConfigField
  .omit({ placeholder: true, required: true })
  .extend({
    type: z.literal("boolean"),
    defaultValue: z.boolean().nullish(),
  });

/**
 * The configuration for a "divisor" field.
 */
const zPluginConfigFieldDivisor = z.object({
  visibility_conditions: z.array(zPluginConfigVisibilityCondition).nullish(),
  type: z.literal("divisor"),
});

/**
 * The configuration for a "file" field.
 */
const zPluginConfigFieldFile = zGenericConfigField.extend({
  type: z.literal("file"),
  defaultValue: z.string().nullish(),
});

/**
 * The configuration for a "folder" field.
 */
const zPluginConfigFieldFolder = zGenericConfigField.extend({
  type: z.literal("folder"),
  defaultValue: z.string().nullish(),
});

/**
 * The configuration for a "string-list" field.
 */
const zPluginConfigFieldStringList = zGenericConfigField.extend({
  type: z.literal("string-list"),
  title: z.string().optional(),
  description: z.string().optional(),
  defaultValue: z.array(z.string()).nullish(),
});

/**
 * The configuration for a "select-key-select-value" field.
 */
const zPluginConfigFieldSelectKeySelectValue = zGenericConfigField.extend({
  type: z.literal("select-key-select-value"),
  title: z.string().optional(),
  description: z.string().optional(),
  key: z.object({
    options: z.array(zBasicOption),
  }),
  value: z.object({
    options: z.array(zBasicOption),
  }),
});

/**
 * Configuration for non-recursive fields (without a .configs array).
 */
const zNonRecursiveFields = z.discriminatedUnion("type", [
  zPluginConfigFieldNumber,
  zPluginConfigFieldStringList,
  zPluginConfigFieldSelectKeySelectValue,
  zPluginConfigFieldOption,
  zPluginConfigFieldString,
  zPluginConfigFieldPassword,
  zPluginConfigFieldBoolean,
  zPluginConfigFieldFile,
  zPluginConfigFieldFolder,
  zPluginConfigFieldDivisor,
]);

// ! Attention:
// These types exist because zod doesn't auto-infer types on recursive objects.
// The "row" and "group" don't automatically have types because they use
// the `configs` property recursively, so we have to manually provide the types
// to them via Typescript and using the z.lazy(() => {}) function.

type INonRecursiveFields = z.infer<typeof zNonRecursiveFields>;

export type IShallowGroupField = {
  type: "group";
  icon?: string | null;
  name?: string | null;
  field: string;
  configs: (
    | INonRecursiveFields
    | IShallowGroupField
    | IShallowRowField
    | IShallowRadioField
  )[];
  visibility_conditions?:
    | z.infer<typeof zPluginConfigVisibilityCondition>[]
    | null;
};

export type IShallowRowField = {
  type: "row";
  configs: (
    | INonRecursiveFields
    | IShallowGroupField
    | IShallowRowField
    | IShallowRadioField
  )[];
  visibility_conditions?:
    | z.infer<typeof zPluginConfigVisibilityCondition>[]
    | null;
};

export type IShallowRadioField = {
  type: "radio";
  field: string;
  defaultValue?: string | null;
  options: Array<{
    label?: string | null;
    value: string;
    color?: string | null;
    icon?: string | null;
    description?: string | null;
    configs: (
      | INonRecursiveFields
      | IShallowGroupField
      | IShallowRowField
      | IShallowRadioField
    )[];
  }>;
  visibility_conditions?:
    | z.infer<typeof zPluginConfigVisibilityCondition>[]
    | null;
};

/**
 * The configuration for a "row" field.
 */
const zPluginConfigFieldRow: z.ZodType<IShallowRowField> = z.lazy(() =>
  zGenericConfigField.extend({
    type: z.literal("row"),
    configs: z.array(
      zNonRecursiveFields
        .or(zPluginConfigFieldRow)
        .or(zPluginConfigFieldGroup)
        .or(zPluginConfigFieldRadio),
    ),
  }),
);

/**
 * The configuration for a "group" field.
 */
const zPluginConfigFieldGroup: z.ZodType<IShallowGroupField> = z.lazy(() =>
  zGenericConfigField.extend({
    type: z.literal("group"),
    configs: z.array(
      zNonRecursiveFields
        .or(zPluginConfigFieldRow)
        .or(zPluginConfigFieldGroup)
        .or(zPluginConfigFieldRadio),
    ),
  }),
);

/**
 * The configuration for a "radio" field.
 */
const zPluginConfigFieldRadio: z.ZodType<IShallowRadioField> = z.lazy(() =>
  zGenericConfigField.omit({ icon: true, name: true }).extend({
    type: z.literal("radio"),
    defaultValue: z.string().nullish(),
    options: z.array(
      z.object({
        label: z.string().nullish(),
        value: z.string(),
        color: z.string().nullish(),
        icon: zIcon.nullish(),
        description: z.string().nullish(),
        configs: z.array(
          zNonRecursiveFields
            .or(zPluginConfigFieldRow)
            .or(zPluginConfigFieldGroup)
            .or(zPluginConfigFieldRadio),
        ),
      }),
    ),
  }),
);

/**
 * All field configurations.
 */
export const zPluginConfigField = zPluginConfigFieldRadio
  .or(zPluginConfigFieldNumber)
  .or(zPluginConfigFieldStringList)
  .or(zPluginConfigFieldSelectKeySelectValue)
  .or(zPluginConfigFieldOption)
  .or(zPluginConfigFieldString)
  .or(zPluginConfigFieldPassword)
  .or(zPluginConfigFieldBoolean)
  .or(zPluginConfigFieldFile)
  .or(zPluginConfigFieldFolder)
  .or(zPluginConfigFieldDivisor)
  .or(zPluginConfigFieldRow)
  .or(zPluginConfigFieldGroup);

/**
 * This is an exchanged message between the main API thread
 * and the plugin worker thread.
 */
const zPluginMessage = z.object({
  connectionID: z.string(),
  error: z.any().optional(),
  event: z.string().optional(),
  method: z.string(),
  params: z.any(),
  setupID: z.string().optional(),
  type: z
    .enum(["pluginRequest", "pluginResponse", "apiRequest", "apiResponse"])
    .optional(),
});

/**
 * Generic setup configuration of a plugin.
 * Other types of plugin may inherit this interface and expand on it.
 */
const zPluginSetup = z.object({
  id: z.string(),
  name: z.string(),
  configs: z.array(zPluginConfigField).optional(),
  type: zPluginType,
});

/**
 * Setup configuration for "action-trigger" plugins.
 */
const zActionTriggerModuleSetup = zPluginSetup.omit({ type: true }).extend({
  option: z.object({
    configs: z.array(zPluginConfigField).optional(),
    description: z.string(),
    name: z.string(),
  }),
});

/**
 * Setup configuration for "action-type" plugins.
 */
const zActionTypeModuleSetup = zPluginSetup.omit({ type: true }).extend({
  option: z.object({
    configs: z.array(zPluginConfigField).optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    name: z.string(),
  }),
});

/**
 * Storage item of a plugin.
 */
const zPluginStorageItem = z.object({
  key: z.string(),
  type: z.enum(["string", "number", "boolean", "object", "null"]),
  value: z.any(),
});

/**
 * Configuration to set a plugin storage item.
 */
export const zPluginStorageItemSet = zPluginStorageItem
  .omit({ created_at: true, type: true })
  .transform((x) => {
    let type = "string";
    if (x.value === null) {
      type = "null";
    } else if (typeof x.value === "boolean") {
      type = "boolean";
    } else if (typeof x.value === "string") {
      type = "string";
    } else if (typeof x.value === "number") {
      type = "number";
    } else if (typeof x.value === "object") {
      type = "object";
    }
    return {
      ...x,
      type,
    };
  });

/**
 */
export const zModuleState = z.enum([
  "idle",
  "stopping",
  "starting",
  "started",
  "stopped",
]);

/**
 */
export const zPluginState = z.enum([
  "idle",
  "disabled",
  "stopping",
  "starting",
  "started",
  "stopped",
]);

/**
 */
export const zPluginModule = zPluginSetup.extend({
  error: z.string().nullish(),
  state: zModuleState,
  message: z.any(),
});

/**
 */
export const zPlugin = z.object({
  publisher: zPluginPublisher,
  slug: z.string(),
  state: zPluginState,
  id: z.string(),
  full_description: z.string(),
  short_description: z.string(),
  name: z.string(),
  modules: z.array(zPluginModule),
  version: z.string(),
  error: z.string().nullish(),
  allow_disable: z.boolean().nullish(),
  allow_uninstall: z.boolean().nullish(),
});

/**
 * Configuration to show a message in the module.
 */
export const zModuleMessageOptions = z.object({
  icon: zIcon.nullish(),
  color: z.string().nullish(),
  message: z.string(),
  iconColor: z.string().nullish(),
});

/**
 * Configuration of a type of message in a module.
 */
export const zModuleMessageType = z.enum(["info", "error", "warning"]);

/**
 * Configuration of the action of a button module.
 */
const zPluginButtonModuleSetupAction = z.union([
  z.object({
    type: z.literal("open-url"),
    url: z.string(),
  }),
  z.object({
    type: z.literal("select-file"),
    extension: z.string().optional(),
    title: z.string().optional(),
  }),
]);

/**
 * Configuration of the option of a button module.
 */
const zPluginButtonModuleSetupOption = z.object({
  icon: zIcon,
  text: z.string().nullish(),
  color: z.string().nullish(),
  tooltip: z.string().nullish(),
  action: zPluginButtonModuleSetupAction,
});

/**
 * Configuration of item in a plugin list.
 */
const zPluginListItem = z.object({
  publisher: zPluginPublisher.nullish(),
  buttons: z.object({
    sidebar: z.array(
      zPluginButtonModuleSetupOption.extend({ position: z.number() }),
    ),
    navbar: z.array(zPluginButtonModuleSetupOption),
    sidebarFooter: z.array(zPluginButtonModuleSetupOption),
  }),
  error: z.boolean().nullish(),
  hidden: z.boolean().nullish(),
  allow_disable: z.boolean().nullish(),
  allow_uninstall: z.boolean().nullish(),
  id: z.string(),
  name: z.string(),
  version: z.string(),
  state: zPluginState,
  types: z.array(zPluginType),
  description: z.string().nullish(),
});

/**
 * Configuration of the list of plugins.
 */
const zPluginList = z.array(zPluginListItem);

/**
 * Settings file content of the plugin.
 */
const zPluginSettingsModule = z.object({
  id: z.string(),
  values: z.any(),
  disabled: z.boolean().optional(),
});

/**
 * Settings file content of the plugin.
 */
const zPluginSettings = z.object({
  disabled: z.boolean(),
  modules: z.array(zPluginSettingsModule),
});

/**
 * Single item in a list of modules.
 */
export const zPluginModuleListItem = z.object({
  pluginID: z.string(),
  pluginName: z.string(),
  setup: zActionTypeModuleSetup,
});

/**
 * List of modules.
 */
export const zPluginModuleList = z.array(zPluginModuleListItem);

/**
 * A Single resolved item of a filesystem.
 */
interface IPluginFilesystemItem {
  name: string;
  path: string;
  is_folder: boolean;
  children: IPluginFilesystemItem[];
}

export type { IPluginFilesystemItem };
export type IActionTriggerModuleSetup = z.infer<
  typeof zActionTriggerModuleSetup
>;
export type IActionTypeModuleSetup = z.infer<typeof zActionTypeModuleSetup>;
export type IModuleMessageOptions = z.infer<typeof zModuleMessageOptions>;
export type IModuleSetup = z.infer<typeof zPluginSetup>;
export type IModuleSetupWithoutType = Omit<IModuleSetup, "type">;
export type IPlugin = z.infer<typeof zPlugin>;
export type IPluginButtonModuleSetupAction = z.infer<
  typeof zPluginButtonModuleSetupAction
>;
export type IPluginButtonModuleSetupOption = z.infer<
  typeof zPluginButtonModuleSetupOption
>;
export type IPluginClassListItem = z.infer<typeof zPluginClassListItem>;
export type IPluginConfigField = z.infer<typeof zPluginConfigField>;
export type IPluginConfigFieldBoolean = z.infer<
  typeof zPluginConfigFieldBoolean
>;
export type IPluginConfigFieldDivisor = z.infer<
  typeof zPluginConfigFieldDivisor
>;
export type IPluginConfigFieldFile = z.infer<typeof zPluginConfigFieldFile>;
export type IPluginConfigFieldFolder = z.infer<typeof zPluginConfigFieldFolder>;
export type IPluginConfigFieldGroup = z.infer<typeof zPluginConfigFieldGroup>;
export type IPluginConfigFieldNumber = z.infer<typeof zPluginConfigFieldNumber>;
export type IPluginConfigFieldOption = z.infer<typeof zPluginConfigFieldOption>;
export type IPluginConfigFieldPassword = z.infer<
  typeof zPluginConfigFieldPassword
>;
export type IPluginConfigFieldRadio = z.infer<typeof zPluginConfigFieldRadio>;
export type IPluginConfigFieldRow = z.infer<typeof zPluginConfigFieldRow>;
export type IPluginConfigFieldString = z.infer<typeof zPluginConfigFieldString>;
export type IPluginConfigFieldStringList = z.infer<
  typeof zPluginConfigFieldStringList
>;
export type IPluginInstallOptions = z.infer<typeof zPluginInstallOptions>;
export type IPluginList = z.infer<typeof zPluginList>;
export type IPluginListItem = z.infer<typeof zPluginListItem>;
export type IPluginLogChannel = z.infer<typeof zPluginLogChannel>;
export type IPluginMessage = z.infer<typeof zPluginMessage>;
export type IPluginModule = z.infer<typeof zPluginModule>;
export type IPluginModuleList = z.infer<typeof zPluginModuleList>;
export type IPluginModuleListItem = z.infer<typeof zPluginModuleListItem>;
export type IPluginPayloadEncoderList = any;
export type IPluginPublisher = z.infer<typeof zPluginPublisher>;
export type IPluginSettings = z.infer<typeof zPluginSettings>;
export type IPluginSettingsModule = z.infer<typeof zPluginSettingsModule>;
export type IPluginStorageItem = z.infer<typeof zPluginStorageItem>;
export type IPluginStorageItemSet = z.infer<typeof zPluginStorageItemSet>;
export type TModuleMessageType = z.infer<typeof zModuleMessageType>;
export type TModuleState = z.infer<typeof zModuleState>;
export type TPluginPermission = z.infer<typeof zPluginPermission>;
export type TPluginState = z.infer<typeof zPluginState>;
export type TPluginType = z.infer<typeof zPluginType>;
