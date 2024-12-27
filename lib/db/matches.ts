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

export async function getPendingRequestsFor(
  userId: User["id"],
  howMany: number
) {
  return await prisma.match.findMany({
    where: {
      userTwoId: userId,
      value: MatchRequest.PENDING,
    },
    include: {
      userOne: true,
    },
  });
}
