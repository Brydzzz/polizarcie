"use server";
import { prisma } from "@/prisma";
import { Match, MatchRequest, User } from "@prisma/client";

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
    take: howMany,
    where: {
      userTwoId: userId,
      value: MatchRequest.PENDING,
    },
    include: {
      userOne: true,
    },
    orderBy: {
      sentAt: "desc",
    },
  });
}

export async function DenyMatchRequest(
  userOneId: Match["userOneId"],
  userTwoId: Match["userTwoId"]
) {
  return await prisma.match.update({
    where: {
      userOneId_userTwoId: {
        userOneId: userOneId,
        userTwoId: userTwoId,
      },
    },
    data: {
      value: MatchRequest.DENIED,
    },
  });
}

export async function AcceptMatchRequest(
  userOneId: Match["userOneId"],
  userTwoId: Match["userTwoId"]
) {
  return await prisma.match.update({
    where: {
      userOneId_userTwoId: {
        userOneId: userOneId,
        userTwoId: userTwoId,
      },
    },
    data: {
      value: MatchRequest.ACCEPTED,
    },
  });
}
