"server only";

import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/db/users";
import { hasPermission, Permissions } from "@/lib/permissions";

export async function getCurrentUser() {
  const session = await auth();
  if (session?.user?.email == undefined) return null;
  return await getUserByEmail(session.user.email);
}

export async function currentUserHasPermission<
  Resource extends keyof Permissions
>(
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  const user = await getCurrentUser();
  if (user == null) return false;
  return await hasPermission(user, resource, action, data);
}
