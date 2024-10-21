import { z } from "zod";
import { v4 as uuid } from "uuid";
import { zObjectID, zToken } from "../index.ts";
import { generateResourceID } from "../../Shared/ResourceID.ts";

/**
 * Configuration of an account.
 */
export const zAccount = z.object({
  id: zObjectID,
  name: z.string(),
  username: z.string(),
  password: z.string(),
  created_at: z.date(),
  password_hint: z.string().nullish(),
});

/**
 * Configuration of the account list.
 */
export const zAccountList = z.array(zAccount.partial().extend({ password: z.string(), id: zObjectID }));

/**
 * Allowed fields in a account list query.
 */
const zAccountListQueryField = z.enum(["id", "name", "username", "password", "password_hint", "created_at"]);

/**
 * Configuration of the account list.
 */
export const zAccountListQuery = z.object({
  fields: z
    .array(zAccountListQueryField)
    .nullish()
    .transform((x) => {
      const values = x || ["id", "name"];
      if (!values.includes("id")) values.push("id");
      return values;
    }),
});

/**
 * Configuration to create a new account.
 */
export const zAccountCreate = zAccount
  .omit({
    created_at: true,
    id: true,
  })
  .transform((x) => ({
    ...x,
    created_at: new Date(),
    id: generateResourceID(),
  }));

/**
 * Configuration of an account token.
 */
export const zAccountToken = z.object({
  token: zToken,
  expire_time: z.string(),
  created_at: z.date(),
  permission: z.enum(["full", "read", "write"]).default("full"),
});

/**
 * Configuration to create a new account token.
 */
export const zAccountTokenCreate = zAccountToken
  .omit({ created_at: true, token: true })
  .extend({
    expire_time: z
      .string()
      .nullish()
      .transform((e) => e || "1 month"),
  })
  .transform((x) => ({
    ...x,
    token: uuid(),
    created_at: new Date(),
  }));

export type IAccount = z.infer<typeof zAccount>;
export type IAccountList = z.infer<typeof zAccountList>;
export type IAccountCreate = z.infer<typeof zAccountCreate>;
export type IAccountToken = z.infer<typeof zAccountToken>;
export type IAccountTokenCreate = z.input<typeof zAccountTokenCreate>;
export type IAccountListQuery = z.input<typeof zAccountListQuery>;
