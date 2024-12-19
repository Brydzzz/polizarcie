import { invokeTransferWithJSON } from "./misc.server";

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
