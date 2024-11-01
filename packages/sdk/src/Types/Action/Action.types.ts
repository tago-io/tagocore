import { z } from "zod";
import { generateResourceID } from "../../Shared/ResourceID.ts";
import {
  zActiveAutoGen,
  zName,
  zObjectID,
  zQuery,
  zTagsAutoGen,
} from "../Common/Common.types.ts";
import createQueryOrderBy from "../Helpers/createQueryOrderBy.ts";
import preprocessBoolean from "../Helpers/preprocessBoolean.ts";
import preprocessObject from "../Helpers/preprocessObject.ts";
import removeNullValues from "../Helpers/removeNullValues.ts";
import {
  type IPluginConfigField,
  zPluginModuleIDCombo,
} from "../Plugin/Plugin.types.ts";
import { zTags } from "../Tag/Tag.types.ts";

/**
 * Validation for a "script" action type.
 */
export const zActionTypeScript = z.object({
  type: z.literal("script"),
  script: z.union([zObjectID, z.array(zObjectID)]),
});

/**
 * Validation for a "post" action type.
 */
export const zActionTypePost = z.object({
  type: z.literal("post"),
  url: z.string().url(),
  headers: z.record(z.string()).optional(),
  fallback_token: z
    .string()
    .uuid("Invalid fallback token")
    .nullable()
    .optional(),
});

/**
 * Validation for a "tagoio" action type.
 */
export const zActionTypeTagoIO = z.object({
  type: z.literal("tagoio"),
  token: z.string().uuid(),
});

/**
 * Validation for an action type that uses a plugin module.
 */
export const zActionTypePluginModule = z
  .object({ type: zPluginModuleIDCombo })
  .passthrough();

/**
 * Validation for the `action` object of an action.
 */
const zActionType = z.any().transform((x) => {
  if (x?.type === "script") {
    return zActionTypeScript.parse(x);
  }
  if (x?.type === "post") {
    return zActionTypePost.parse(x);
  }
  if (x?.type === "tagoio") {
    return zActionTypeTagoIO.parse(x);
  }
  if (x) {
    return zActionTypePluginModule.parse(x);
  }
});

/**
 * Base configuration of an action.
 */
export const zAction = z.object({
  action: z.any(),
  active: z.boolean(),
  created_at: z.date(),
  description: z.string().nullish(),
  id: zObjectID,
  last_triggered: z.date().nullish(),
  name: zName,
  tags: zTags,
  trigger: z.any().optional(),
  type: z.string(),
  updated_at: z.date().nullish(),
  lock: z
    .boolean()
    .nullish()
    .transform((x) => x || false),
});

/**
 * Configuration to create a new action.
 */
export const zActionCreate = zAction
  .omit({
    last_triggered: true,
    created_at: true,
    id: true,
    updated_at: true,
  })
  .extend({
    type: z
      .enum(["condition", "interval", "schedule"])
      .or(zPluginModuleIDCombo),
    action: zActionType,
    active: zActiveAutoGen,
    tags: zTagsAutoGen,
  })
  .transform((x) =>
    removeNullValues({
      ...x,
      created_at: new Date(),
      id: generateResourceID(),
    }),
  );

/**
 * Configuration to edit an existing Action.
 */
export const zActionEdit = zAction
  .omit({
    id: true,
    created_at: true,
  })
  .extend({
    active: zAction.shape.active.nullish(),
    tags: zAction.shape.tags.nullish(),
  })
  .partial();

/**
 * Configuration of the action list.
 */
export const zActionList = z.array(
  zAction.partial().extend({
    id: zObjectID,
    tags: zTags,
  }),
);

/**
 * Allowed fields in an action list query.
 */
const zActionListQueryFields = z.enum([
  "id",
  "name",
  "tags",
  "active",
  "trigger",
  "action",
  "last_triggered",
  "created_at",
  "updated_at",
  "type",
  "lock",
  "*",
]);

/**
 * Configuration to query the action list.
 */
export const zActionListQuery = zQuery.extend({
  filter: z.preprocess(
    preprocessObject,
    z
      .object({
        id: zObjectID.or(z.array(zObjectID)),
        tags: zTags,
        name: z.string(),
        active: z.preprocess(preprocessBoolean, z.boolean()),
        type: z.string(),
      })
      .partial()
      .nullish()
      .transform((x) => x ?? {}),
  ),
  fields: z
    .array(zActionListQueryFields)
    .nullish()
    .transform((x) => {
      const values = x || ["id", "name", "tags"];
      if (!values.includes("id")) values.push("id");
      if (!values.includes("tags")) values.push("tags");
      return values;
    }),
  orderBy: createQueryOrderBy(zActionListQueryFields),
});

export type IAction = z.infer<typeof zAction>;
export type IActionCreate = z.infer<typeof zActionCreate>;
export type IActionEdit = z.infer<typeof zActionEdit>;
export type IActionList = z.infer<typeof zActionList>;
export type IActionListQuery = z.input<typeof zActionListQuery>;
export type IActionTypeScript = z.infer<typeof zActionTypeScript>;
export type IActionTypeTagoIO = z.infer<typeof zActionTypeTagoIO>;
export type IActionTypePost = z.infer<typeof zActionTypePost>;

export interface IActionOption {
  description?: string;
  icon: string;
  name: string;
  configs?: IPluginConfigField[];
  id: string;
}
