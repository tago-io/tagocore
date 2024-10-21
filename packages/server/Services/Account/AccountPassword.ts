import {
  randomBytes as randomBytesNoPromise,
  scrypt as scryptNoPromise,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptNoPromise);
const randomBytes = promisify(randomBytesNoPromise);

/**
 * Generates a one-way hash of a password.
 */
async function encryptAccountPassword(password: string): Promise<string> {
  if (typeof password !== "string" || password.length > 100) {
    return Promise.reject("Password should be less than 100 character");
  }

  const salt = (await randomBytes(12)).toString("hex");
  const passwordBuffer = (await scrypt(password, salt, 48)) as Buffer;
  const passwordHex = passwordBuffer.toString("hex");

  return `${salt.length}${salt}${passwordHex}`;
}

/**
 * Compares a plain text password and a hashed password.
 */
async function compareAccountPasswordHash(
  password: string | undefined,
  hash: string,
): Promise<boolean> {
  if (typeof password !== "string" || password.length > 100) {
    return Promise.reject("Password should be less than 100 character");
  }

  const saltLength = Number(hash.slice(0, 2));
  const salt = hash.substring(2).slice(0, saltLength);
  const realHash = hash.substring(2).slice(saltLength);

  const passwordBuffer = (await scrypt(password, salt, 48)) as Buffer;
  const passwordHex = passwordBuffer.toString("hex");

  return passwordHex === realHash;
}

export { encryptAccountPassword, compareAccountPasswordHash };
