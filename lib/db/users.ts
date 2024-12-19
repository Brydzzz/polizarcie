"use server";

import { prisma } from "@/prisma";
import { Restaurant, User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
}

export async function addToLiked(userId: User["id"], restId: Restaurant["id"]) {
  return await prisma.userFavoriteRestaurant.create({
    data: {
      userId: userId,
      restaurantId: restId,
      rankingPosition: 10,
    },
  });
}

export async function getUnmatchedUser(
  userId: User["id"],
  excludeIds: User["id"][]
) {
  return await prisma.user.findFirst({
    where: {
      id: { not: userId },
      AND: [
        {
          userOneMatch: {
            none: {
              OR: [
                { userOneId: userId },
                { userTwoId: userId },
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
                { userOneId: userId },
                { userTwoId: userId },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          id: { notIn: excludeIds }, // Exclude users directly as well.
        },
      ],
    },
  });
}

export async function getUnmatchedUsers(
  userId: User["id"],
  excludeIds: User["id"][],
  howMany: number
) {
  return await prisma.user.findMany({
    take: howMany,
    where: {
      id: { not: userId },
      AND: [
        {
          userOneMatch: {
            none: {
              OR: [
                { userOneId: userId },
                { userTwoId: userId },
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
                { userOneId: userId },
                { userTwoId: userId },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          id: { notIn: excludeIds }, // Exclude users directly as well.
        },
      ],
    },
  });
}
export async function removeLike(userId: User["id"], restId: Restaurant["id"]) {
  return await prisma.userFavoriteRestaurant.delete({
    where: {
      userId_restaurantId: {
        userId: userId,
        restaurantId: restId,
      },
    },
  });
}

export async function checkIfRestLikedByUser(
  userId: User["id"],
  restId: Restaurant["id"]
) {
  return (
    (await prisma.userFavoriteRestaurant.findFirst({
      where: {
        userId: userId,
        restaurantId: restId,
      },
    })) != null
  );
}

export async function getTopLikedRests(userId: User["id"]) {
  return await prisma.restaurant.findMany({
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
}

export async function getUserByEmail(email: User["email"]) {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
}
