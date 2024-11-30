"use server";

import { auth } from "@/auth";
import { fetchUserByEmail, fetchUserById } from "@/utils/db/users";

export async function getUserById(id: string) {
  return await fetchUserById(id);
}

export async function getCurrentUser() {
  const session = await auth();
  if (session?.user?.email == undefined) return null;
  return await fetchUserByEmail(session.user.email);
}
