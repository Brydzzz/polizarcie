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

export async function checkIfRestLikedByUser(userId: User['id'], restId: Restaurant['id']) {
  return (await prisma.userFavoriteRestaurant.findFirst({
    where: {
      userId: userId,
      restaurantId: restId
    }
  })) != null
}

export async function getUserByEmail(email: User["email"]) {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
}
