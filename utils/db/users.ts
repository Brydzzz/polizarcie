import { prisma } from "@/utils/prisma";

export async function fetchUserById(id: string) {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
}

export async function fetchUserByEmail(email: string) {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
}
