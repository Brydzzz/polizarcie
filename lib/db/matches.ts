"use server";
import { prisma } from "@/prisma";
import { MatchRequest, User } from "@prisma/client";

export async function matchYesWith(ourId: User["id"], theirId: User["id"]) {
  return await prisma.match.create({
    data: {
      userOneId: ourId,
      userTwoId: theirId,
      value: MatchRequest.PENDING,
    },
  });
}

export async function matchNoWith(ourId: User["id"], theirId: User["id"]) {
  return await prisma.match.create({
    data: {
      userOneId: ourId,
      userTwoId: theirId,
      value: MatchRequest.DENIED,
    },
  });
}
