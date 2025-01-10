import { ZodError } from "zod";
import { invokeTransferWithJSON } from "./misc.server";

import { AppDispatch } from "@/lib/store/store";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import * as crypto from "crypto";

export class PoliError {
  code: number;
  message: string;
  poliErrorTest: boolean = true;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}

export function unauthorized(): PoliError {
  return new PoliError(401, "Unauthorized!");
}

export function forbidden(): PoliError {
  return new PoliError(403, "Forbidden!");
}

export function badData(reason?: string) {
  return new PoliError(400, `Bad data!${reason ? " - " + reason : ""}`);
}

export function internalServerError() {
  return new PoliError(500, "Internal server error!");
}

export function badDataFromZodError(error: ZodError) {
  return badData(error.issues.map((issue) => issue.message).join(", "));
}

export function throwParsedZodError(error: ZodError, dispatch?: AppDispatch) {
  const poliError = badDataFromZodError(error);
  if (dispatch)
    dispatch(addSnackbar({ message: poliError.message, type: "error" }));
  throw new Error(poliError.message);
}

export function parseBigNumber(value: number) {
  return value >= 10000000
    ? `${Math.round(value / 1000000)}M`
    : value >= 1000000
    ? `${Math.round(value / 100000) / 10}M`
    : value >= 10000
    ? `${Math.round(value / 1000)}k`
    : value >= 1000
    ? `${Math.round(value / 100) / 10}k`
    : value;
}

export async function makeRequest<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Func extends (...args: any[]) => Promise<any>
>(
  func: Func,
  args: Parameters<Func>,
  dispatch?: AppDispatch
): Promise<Exclude<Awaited<ReturnType<Func>>, PoliError>> {
  const result = (await transferWithJSON(func, args)) as any;
  if (result && result.poliErrorTest) {
    const error = `POLI_ERROR;${result.code};${result.message}`;
    if (dispatch) dispatch(addSnackbar({ message: error, type: "error" }));
    throw new Error(error);
  }
  return result;
}

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
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

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
