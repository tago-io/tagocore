import { z } from "zod";
import {
  zActiveAutoGen,
  zDateAutoGen,
  zName,
  zObjectID,
  zObjectIDAutoGen,
  zQuery,
  zTagsAutoGen,
} from "../Common/Common.types.ts";
import createQueryOrderBy from "../Helpers/createQueryOrderBy.ts";
import preprocessBoolean from "../Helpers/preprocessBoolean.ts";
import preprocessObject from "../Helpers/preprocessObject.ts";
import { zLog } from "../Log/Log.types.ts";
import { zTags } from "../Tag/Tag.types.ts";

export interface IAnalysisVariable {
  key: string;
  value: string;
}

/**
 * Configuration of a single environment variable.
 */
export const zEnvironmentVariable = z.object({
  key: z.string().nonempty(),
  value: z.string().nonempty(),
});

/**
 * Base configuration of an analysis.
 */
export const zAnalysis = z.object({
  active: z.boolean(),
  binary_path: z.string().nullable(),
  console: z.array(zLog),
  created_at: z.date(),
  file_path: z.string().nullable(),
  id: zObjectID,
  last_run: z.date().nullish(),
  name: zName,
  options: z.any(),
  tags: zTags,
  updated_at: z.date().nullish(),
  variables: z.array(zEnvironmentVariable),
});

/**
 * Configuration to create a new analysis.
 */
export const zAnalysisCreate = zAnalysis
  .partial()
  .omit({ console: true, id: true, last_run: true })
  .extend({
    active: zActiveAutoGen,
    created_at: zDateAutoGen,
    id: zObjectIDAutoGen,
    tags: zTagsAutoGen,
    variables: z
      .array(zEnvironmentVariable)
      .optional()
      .transform((x) => x ?? [])
      .or(z.undefined()),
  });

/**
 * Configuration to edit an existing analysis.
 */
export const zAnalysisEdit = zAnalysis
  .partial()
  .omit({
    id: true,
    console: true,
    updated_at: true,
    created_at: true,
  })
  .extend({
    updated_at: zDateAutoGen.or(z.undefined()),
  });

/**
 * Configuration of the analysis list.
 */
export const zAnalysisList = z.array(
  zAnalysis.partial().extend({
    id: zObjectID,
    tags: zTags,
  }),
);

/**
 * Configuration of the analysis log list.
 */
export const zAnalysisLogList = z.array(
  zLog.extend({ analysis_id: zObjectID }),
);

/**
 * Allowed fields in an analysis list query.
 */
const zAnalysisListQueryFields = z.enum([
  "id",
  "name",
  "tags",
  "active",
  "last_run",
  "binary_path",
  "file_path",
  "created_at",
  "updated_at",
  "variables",
  "*",
]);

/**
 * Configuration to query the analysis list.
 */
export const zAnalysisListQuery = zQuery.extend({
  filter: z.preprocess(
    preprocessObject,
    z
      .object({
        id: zObjectID.or(z.array(zObjectID)),
        tags: zTags,
        name: z.string(),
        active: z.preprocess(preprocessBoolean, z.boolean()),
        binary_path: z.string(),
        file_path: z.string(),
      })
      .partial()
      .nullish()
      .transform((x) => x ?? {}),
  ),
  fields: z
    .array(zAnalysisListQueryFields)
    .nullish()
    .transform((x) => {
      const values = x || ["id", "name", "tags"];
      if (!values.includes("id")) values.push("id");
      if (!values.includes("tags")) values.push("tags");
      return values;
    }),
  orderBy: createQueryOrderBy(zAnalysisListQueryFields),
});

export type IAnalysis = z.infer<typeof zAnalysis>;
export type IAnalysisCreate = z.infer<typeof zAnalysisCreate>;
export type IAnalysisEdit = z.infer<typeof zAnalysisEdit>;
export type IAnalysisList = z.infer<typeof zAnalysisList>;
export type IAnalysisListQuery = z.input<typeof zAnalysisListQuery>;
export type IAnalysisLogList = z.infer<typeof zAnalysisLogList>;
