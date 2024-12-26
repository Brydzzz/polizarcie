"use server";
import { prisma } from "@/prisma";
import { User } from "@prisma/client";

export async function matchYesWith(ourId: User["id"], theirId: User["id"]) {
  return await prisma.match.create({
    data: {
      userOneId: ourId,
      userTwoId: theirId,
      value: true,
    },
  });
}

export async function matchNoWith(ourId: User["id"], theirId: User["id"]) {
  return await prisma.match.create({
    data: {
      userOneId: ourId,
      userTwoId: theirId,
      value: false,
    },
  });
}
