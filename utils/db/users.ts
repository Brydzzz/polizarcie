"server only";

import { prisma } from "@/utils/prisma";

export async function getUserById(id: string) {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
}
