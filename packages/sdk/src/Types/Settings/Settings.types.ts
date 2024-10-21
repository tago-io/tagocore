import { z } from "zod";

/**
 * Configuration of the application settings.
 */
export const zSettings = z.object({
  database_plugin: z.string().optional(),
  queue_plugin: z.string().optional(),
  filesystem_plugin: z.string().optional(),
  master_password: z.string().optional(),
  port: z
    .preprocess((x) => Number(x), z.number())
    .optional()
    .default(8888)
    .or(z.undefined()),
  settings_folder: z.string().optional(),
  version: z.string().nullish(),
  installed_plugins: z.array(z.string()).optional(),
  custom_plugins: z.array(z.string()).optional(),
});

/**
 * Configuration to edit existing settings.
 */
export const zSettingsEdit = zSettings.partial();

export const zSettingsMetadata = z.object({
  database_plugin_disabled: z.boolean(),
  plugin_folder_disabled: z.boolean(),
  port_disabled: z.boolean(),
});

export type ISettings = z.infer<typeof zSettings>;
export type ISettingsEdit = z.infer<typeof zSettingsEdit>;
export type ISettingsMetadata = z.infer<typeof zSettingsMetadata>;
