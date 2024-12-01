"server only";

import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/db/users";

export async function getCurrentUser() {
  const session = await auth();
  if (session?.user?.email == undefined) return null;
  return await getUserByEmail(session.user.email);
}
