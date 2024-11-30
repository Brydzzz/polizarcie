"use server";

import { getCurrentUser } from "@/actions/users";
import { currentUserHasPermission } from "@/utils/permissions";
import { prisma } from "@/utils/prisma";
import { Dish, DishReview, Restaurant, RestaurantReview } from "@prisma/client";

export async function getRestaurantReviewsByRestaurantId(id: Restaurant["id"]) {
  return await prisma.restaurantReview.findMany({
    where: {
      restaurantId: id,
    },
  });
}

export async function getRestaurantAvgStarsById(id: Restaurant["id"]) {
  return await prisma.restaurantReview.aggregate({
    _avg: {
      stars: true,
    },
    where: {
      restaurantId: id,
    },
  });
}

export async function getDishReviewsByDishId(id: Dish["id"]) {
  return await prisma.dishReview.findMany({
    where: {
      dishId: id,
    },
  });
}

export async function createRestaurantReview(data: RestaurantReview) {
  if (!currentUserHasPermission("reviews", "create", data)) return null;
  const user = await getCurrentUser();
  if (user == null) return null;
  return await prisma.restaurantReview.create({
    data: {
      restaurantId: data.restaurantId,
      authorId: user.id,
      amountSpent: data.amountSpent,
      content: data.content,
      stars: data.stars,
    },
  });
}

export async function createDishReview(data: DishReview) {
  if (!currentUserHasPermission("reviews", "create", data)) return null;
  const user = await getCurrentUser();
  if (user == null) return null;
  return await prisma.dishReview.create({
    data: {
      dishId: data.dishId,
      authorId: user.id,
      content: data.content,
      stars: data.stars,
    },
  });
}

export async function updateRestaurantReview(data: RestaurantReview) {
  if (!currentUserHasPermission("reviews", "edit", data)) return null;
  return await prisma.restaurantReview.update({
    where: { id: data.id },
    data: {
      amountSpent: data.amountSpent,
      content: data.content,
      stars: data.stars,
    },
  });
}

export async function updateDishReview(data: DishReview) {
  if (!currentUserHasPermission("reviews", "edit", data)) return null;
  return await prisma.dishReview.update({
    where: { id: data.id },
    data: {
      content: data.content,
      stars: data.stars,
    },
  });
}

export async function deleteRestaurantReview(id: string) {
  if (!currentUserHasPermission("reviews", "delete", { id: id })) return null;
  return await prisma.restaurantReview.delete({
    where: { id: id },
  });
}

export async function deleteDishReview(id: string) {
  if (!currentUserHasPermission("reviews", "delete", { id: id })) return null;
  return await prisma.dishReview.delete({ where: { id: id } });
}
