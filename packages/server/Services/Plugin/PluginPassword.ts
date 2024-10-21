import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

/**
 * Secret to the password hash.
 */
const SECRET = "TCore";
/**
 * 32 digit secret to the password hash.
 */
const SECRET_KEY = createHash("sha256")
  .update(String(SECRET))
  .digest("base64")
  .substring(0, 32);

/**
 * Encrypts a password to be stored.
 */
function encryptPluginConfigPassword(password: string) {
  const iv = randomBytes(16).toString("hex").slice(0, 16);
  const cipher = createCipheriv("aes256", SECRET_KEY, iv);
  const encrypted =
    cipher.update(password, "utf8", "hex") + cipher.final("hex");
  return `${iv}.${encrypted}`;
}

/**
 * Decrypts the password to be read.
 */
function decryptPluginConfigPassword(encrypted: string) {
  const split = encrypted.split(".");
  const iv = split[0];
  const hs = split[1];

  const decipher = createDecipheriv("aes256", SECRET_KEY, iv);
  const decrypted = decipher.update(hs, "hex", "utf8") + decipher.final("utf8");

  return decrypted;
}

export { encryptPluginConfigPassword, decryptPluginConfigPassword };
