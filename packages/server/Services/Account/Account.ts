import {
  type IAccount,
  type IAccountCreate,
  type IAccountList,
  type IAccountListQuery,
  type IAccountToken,
  type IAccountTokenCreate,
  type TGenericID,
  zAccount,
  zAccountCreate,
  zAccountList,
  zAccountToken,
  zAccountTokenCreate,
} from "@tago-io/tcore-sdk/types";
import { z } from "zod";
import { invokeDatabaseFunction } from "../../Plugins/invokeDatabaseFunction.ts";
import {
  compareAccountPasswordHash,
  encryptAccountPassword,
} from "./AccountPassword.ts";

/**
 * Logs into account and returns a token.
 */
export async function login(username: string, password: string) {
  const account = await getAccountByUsername(username);
  if (!account) {
    throw new Error("Invalid credentials");
  }

  const passwordMatches = await compareAccountPasswordHash(
    password,
    account.password,
  );
  if (!passwordMatches) {
    if (account.password_hint) {
      throw new Error(
        `Invalid password. Your password hint is: ${account.password_hint}`,
      );
    }
    throw new Error("Invalid credentials");
  }

  const token = await createAccountToken(account.id);
  return token;
}

/**
 * Retrieves an account by username.
 */
export async function getAccountByUsername(
  username: string,
): Promise<IAccount | null> {
  const account = await invokeDatabaseFunction(
    "getAccountByUsername",
    username,
  );
  if (account) {
    const parsed = await zAccount.parseAsync(account);
    return parsed;
  }
  return null;
}

/**
 * Creates a new account.
 */
export async function createAccount(data: IAccountCreate) {
  const exists = await getAccountByUsername(data.username);
  if (exists) {
    throw new Error("Username already exists");
  }

  const parsed = await zAccountCreate.parseAsync(data);
  parsed.password = await encryptAccountPassword(parsed.password);

  await invokeDatabaseFunction("createAccount", parsed);

  return parsed.id;
}

/**
 * Retrieves an account by its token.
 */
export async function getAccountByToken(token: string): Promise<IAccount> {
  if (!token) {
    throw new Error("Invalid Account Token");
  }
  const account = await invokeDatabaseFunction("getAccountByToken", token);
  if (!account) {
    throw new Error("Invalid Account Token");
  }
  const parsed = await zAccount.parseAsync(account);
  (parsed as any).password = undefined;
  (parsed as any).password_hint = undefined;
  return parsed;
}

/**
 * Retrieves an account token.
 */
export async function getAccountToken(
  token: string,
): Promise<IAccountToken | null> {
  if (!token) {
    throw new Error("Invalid Account Token");
  }
  const tokenData = await invokeDatabaseFunction("getAccountToken", token);
  if (tokenData) {
    const parsed = await zAccountToken.parseAsync(tokenData);
    return parsed;
  }
  return null;
}

/**
 * Creates a new account token.
 */
export async function createAccountToken(
  accountID: TGenericID,
  data?: IAccountTokenCreate,
): Promise<string> {
  const parsed = await zAccountTokenCreate.parseAsync(data || {});
  await invokeDatabaseFunction("createAccountToken", accountID, parsed);
  return parsed.token;
}

/**
 * Retrieves the account list.
 */
export async function getAccountList(
  query: IAccountListQuery,
): Promise<IAccountList> {
  const response = await invokeDatabaseFunction("getAccountList", query);
  const parsed = await zAccountList.parseAsync(response);
  return parsed;
}

/**
 * Retrieves the amount of accounts in the system.
 */
export async function getAccountAmount(): Promise<number> {
  const response = await invokeDatabaseFunction("getAccountAmount");
  const parsed = await z.number().parseAsync(response);
  return parsed;
}
