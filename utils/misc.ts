import { ZodError } from "zod";
import { invokeTransferWithJSON } from "./misc.server";

import * as crypto from "crypto";

export async function transferWithJSON<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Func extends (...args: any[]) => Promise<any>
>(func: Func, args: Parameters<Func>) {
  return JSON.parse(
    await invokeTransferWithJSON(func, JSON.stringify(args))
  ) as ReturnType<Func>;
}

export function randomString(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const blobToDataURL = (blob: Blob) => {
  return new Promise<string | ArrayBuffer | null>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export function parseZodError(error: Error) {
  if (error instanceof ZodError) {
    return { error: error.issues.map((issue) => issue.message).join(", ") };
  }
  return undefined;
}

export function throwParsedIfZodError(error: Error) {
  const zodErr = parseZodError(error);
  if (zodErr) throw new Error(zodErr.error);
}

const config = {
  iterations: 10000,
  saltBytes: 32,
  hashBytes: 64,
  digest: "sha512",
};

export function hashPassword(password: string) {
  return new Promise((resolve: (value: Buffer) => void, reject) => {
    // generate a salt for pbkdf2
    crypto.randomBytes(config.saltBytes, (err, salt) => {
      if (err) {
        return reject(err);
      }

      // hash password
      crypto.pbkdf2(
        password,
        salt,
        config.iterations,
        config.hashBytes,
        config.digest,
        (err, hash) => {
          if (err) {
            return reject(err);
          }

          const combined = Buffer.alloc(hash.length + salt.length + 8);
          combined.writeUInt32BE(salt.length, 0);
          combined.writeUInt32BE(config.iterations, 4);
          salt.copy(combined, 8);
          hash.copy(combined, salt.length + 8);
          resolve(combined);
        }
      );
    });
  });
}

export function verifyPassword(password: string, combined: Buffer) {
  return new Promise((resolve: (value: boolean) => void) => {
    // extract the salt and hash from the combined buffer
    const saltBytes = combined.readUInt32BE(0);
    const hashBytes = combined.length - saltBytes - 8;
    const iterations = combined.readUInt32BE(4);
    const salt = combined.subarray(8, saltBytes + 8);
    const hash = combined.toString("binary", saltBytes + 8);

    // verify the salt and hash against the password
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      hashBytes,
      config.digest,
      (err, verify) => {
        if (err) {
          return resolve(false);
        }
        resolve(verify.toString("binary") === hash);
      }
    );
  });
}
