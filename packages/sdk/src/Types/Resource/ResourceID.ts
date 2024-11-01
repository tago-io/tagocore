import { customAlphabet } from "nanoid";

const hexAlphabet = "1234567890abcdef";
const nanoid = customAlphabet(hexAlphabet, 20);

/**
 * Generate a Hex Format ID with 24 characters for resources.
 * The ID will be unique and can be used to identify a resource uniquely.
 */
export function generateResourceID(): string {
  const firstCase = String(Date.now()).slice(0, 2).split("").reverse().join("");
  const secondCase = Buffer.from([
    Number(String(Date.now()).slice(2, 4)),
  ]).toString("hex");
  return `${firstCase}${secondCase}${nanoid()}`;
}

/**
 * Checks if a resource ID is valid or not.
 * @param id ResourceID
 * @returns Boolean
 */
export function validateResourceID(id?: string): boolean {
  const idSafe = String(id);

  if (idSafe.length !== 24) {
    return false;
  }

  return true;
}
