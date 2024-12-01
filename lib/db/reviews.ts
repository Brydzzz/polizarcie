"use server";

import { currentUserHasPermission } from "@/lib/permissions";
import { prisma } from "@/prisma";
import { getCurrentUser } from "@/utils/users";
import {
  Dish,
  DishReview,
  Restaurant,
  RestaurantReview,
  User,
} from "@prisma/client";

export type RestaurantReviewCreator = Pick<
  RestaurantReview,
  "amountSpent" | "content" | "subjectId" | "stars"
>;
export type RestaurantReviewFull = RestaurantReview & {
  subject: Restaurant;
  author: User;
};
export type DishReviewCreator = Pick<
  DishReview,
  "content" | "subjectId" | "stars"
>;
export type DishReviewFull = DishReview & { subject: Dish; author: User };

export async function getRestaurantReviewsByRestaurantId(
  id: Restaurant["id"],
  take: number,
  skip?: number
): Promise<RestaurantReviewFull[]> {
  return await prisma.restaurantReview.findMany({
    where: {
      subjectId: id,
    },
    include: {
      author: true,
      subject: true,
    },
    take: take,
    skip: skip,
  });
}

export async function getDishReviewsByDishId(
  id: Dish["id"],
  take: number,
  skip?: number
): Promise<DishReviewFull[]> {
  return await prisma.dishReview.findMany({
    where: {
      subjectId: id,
    },
    include: {
      author: true,
      subject: true,
    },
    take: take,
    skip: skip,
  });
}

export async function createRestaurantReview(data: RestaurantReviewCreator) {
  if (!currentUserHasPermission("reviews", "create", data)) return null;
  const user = await getCurrentUser();
  if (user == null) return null;
  return await prisma.restaurantReview.create({
    data: {
      subjectId: data.subjectId,
      authorId: user.id,
      amountSpent: data.amountSpent,
      content: data.content,
      stars: data.stars,
    },
  });
}

export async function createDishReview(data: DishReviewCreator) {
  if (!currentUserHasPermission("reviews", "create", data)) return null;
  const user = await getCurrentUser();
  if (user == null) return null;
  return await prisma.dishReview.create({
    data: {
      subjectId: data.subjectId,
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

export async function getRestaurantAvgStarsById(id: Restaurant["id"]) {
  return await prisma.restaurantReview.aggregate({
    _avg: {
      stars: true,
    },
    where: {
      subjectId: id,
    },
  });
}
