"use server";

import { prisma } from "@/utils/prisma";
import { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
}

export async function getUserByEmail(email: User["email"]) {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
}
