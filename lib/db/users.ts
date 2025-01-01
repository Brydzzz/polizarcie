"use server";

import { prisma } from "@/prisma";
import { getCurrentUser } from "@/utils/users";
import { MatchRequest, Restaurant, User } from "@prisma/client";
import { unauthorized } from "next/navigation";
import {
  clearUserPasswordCache,
  updateUserPasswordFromCache,
} from "./users.server-only";

export async function getUserById(id: User["id"]) {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
}

export async function getUnmatchedUser(user: User, excludeIds: User["id"][]) {
  return await prisma.user.findFirst({
    where: {
      id: { not: user.id },
      preferredGender: user.gender,
      gender: user.preferredGender,
      AND: [
        {
          userOneMatch: {
            none: {
              OR: [
                { userOneId: user.id },
                { userTwoId: user.id },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          userTwoMatch: {
            none: {
              OR: [
                { userOneId: user.id },
                { userTwoId: user.id },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          id: { notIn: excludeIds },
        },
      ],
    },
  });
}

export async function getUsersMatchedWith(userId: User["id"]) {
  return await prisma.user.findMany({
    where: {
      id: { not: userId },
      OR: [
        {
          userOneMatch: {
            some: {
              AND: [
                { OR: [{ userOneId: userId }, { userTwoId: userId }] },
                { value: MatchRequest.ACCEPTED },
              ],
            },
          },
        },
        {
          userTwoMatch: {
            some: {
              AND: [
                { OR: [{ userOneId: userId }, { userTwoId: userId }] },
                { value: MatchRequest.ACCEPTED },
              ],
            },
          },
        },
      ],
    },
    include: {
      medias: true,
    },
  });
}

export async function getUnmatchedUsers(
  user: User,
  excludeIds: User["id"][],
  howMany: number
) {
  return await prisma.user.findMany({
    take: howMany,
    where: {
      id: { not: user.id },
      preferredGender: user.gender,
      gender: user.preferredGender,
      AND: [
        {
          userOneMatch: {
            none: {
              OR: [
                { userOneId: user.id },
                { userTwoId: user.id },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          userTwoMatch: {
            none: {
              OR: [
                { userOneId: user.id },
                { userTwoId: user.id },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          id: { notIn: excludeIds },
        },
      ],
    },
  });
}

export async function addRestaurantToLiked(restaurantId: Restaurant["id"]) {
  const currentUser = await getCurrentUser();
  if (!currentUser) unauthorized();
  return await prisma.userFavoriteRestaurant.create({
    data: {
      userId: currentUser.id,
      restaurantId: restaurantId,
      rankingPosition: 10,
    },
  });
}

export async function removeRestaurantFromLiked(
  restaurantId: Restaurant["id"]
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) unauthorized();
  return await prisma.userFavoriteRestaurant.delete({
    where: {
      userId_restaurantId: {
        userId: currentUser.id,
        restaurantId: restaurantId,
      },
    },
  });
}

export async function isRestaurantLiked(restaurantId: Restaurant["id"]) {
  const currentUser = await getCurrentUser();
  if (!currentUser) unauthorized();
  return (
    (await prisma.userFavoriteRestaurant.findFirst({
      where: {
        userId: currentUser.id,
        restaurantId: restaurantId,
      },
    })) != null
  );
}

export async function getTopLikedRests(userId: User["id"]) {
  const liked = await prisma.restaurant.findMany({
    where: {
      favoriteAmong: {
        some: {
          userId: userId,
          rankingPosition: { in: [1, 2, 3] },
        },
      },
    },
    include: {
      favoriteAmong: true,
    },
  });
  return liked.sort((a, b) => {
    const aRanking = a.favoriteAmong[0]?.rankingPosition ?? Infinity;
    const bRanking = b.favoriteAmong[0]?.rankingPosition ?? Infinity;
    return aRanking - bRanking;
  });
}

export async function getTopLikedRestsForUsers(usersIDs: User["id"][]) {
  return await Promise.all(
    usersIDs.map(async (userId) => {
      const userTopLiked = await prisma.restaurant.findMany({
        where: {
          favoriteAmong: {
            some: {
              userId: userId,
              rankingPosition: { in: [1, 2, 3] },
            },
          },
        },
        include: {
          favoriteAmong: true,
        },
      });
      return userTopLiked.sort((a, b) => {
        const aRanking = a.favoriteAmong[0]?.rankingPosition ?? Infinity;
        const bRanking = b.favoriteAmong[0]?.rankingPosition ?? Infinity;
        return aRanking - bRanking;
      });
    })
  );
}

export async function getUserByEmail(email: User["email"]) {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
}

export async function updateUserLastVerificationMail(id: User["id"]) {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      lastVerificationMail: new Date(),
    },
  });
}

export async function confirmPasswordChange() {
  const currentUser = await getCurrentUser();
  if (!currentUser) unauthorized();
  const result = await updateUserPasswordFromCache(currentUser.id);
  if (result) await clearUserPasswordCache(currentUser.id);
  return result;
}

export async function cancelPasswordChange() {
  const currentUser = await getCurrentUser();
  if (!currentUser) unauthorized();
  return await clearUserPasswordCache(currentUser.id);
}
