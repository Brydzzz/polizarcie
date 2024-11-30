"use server";

export async function invokeTransferWithJSON<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Func extends (...args: any[]) => Promise<any>
>(func: Func, data: string) {
  const args = JSON.parse(data) as Parameters<Func>;
  return JSON.stringify(await func(...args));
}
