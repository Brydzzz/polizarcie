"use server";

import { prisma } from "@/prisma";
import { getCurrentUser } from "@/utils/users";
import { Restaurant, User } from "@prisma/client";
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

export async function addToLiked(userId: User["id"], restId: Restaurant["id"]) {
  return await prisma.userFavoriteRestaurant.create({
    data: {
      userId: userId,
      restaurantId: restId,
      rankingPosition: 10,
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
