"use server";

import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/prisma";
import { currentUserHasPermission, getCurrentUser } from "@/utils/users";
import { Restaurant, RestaurantReview, User } from "@prisma/client";

export type RestaurantReviewCreator = Pick<
  RestaurantReview,
  "amountSpent" | "content" | "subjectId" | "stars"
>;
export type RestaurantReviewFull = RestaurantReview & {
  subject: Restaurant;
  author: User;
};

export async function getRestaurantReviewById(
  id: RestaurantReview["id"]
): Promise<RestaurantReviewFull | null> {
  const result = await prisma.restaurantReview.findFirst({
    where: {
      id: id,
    },
    include: {
      author: true,
      subject: true,
    },
  });
  return !result
    ? result
    : !result.hidden ||
      (await currentUserHasPermission("reviews", "viewHidden", { id: id }))
    ? result
    : null;
}

export async function getRestaurantReviewsByRestaurantId(
  id: Restaurant["id"],
  take: number,
  skip?: number
): Promise<RestaurantReviewFull[]> {
  const currentUser = (await getCurrentUser()) || undefined;
  const result = await prisma.restaurantReview.findMany({
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
  return result.filter(
    (e) => !e.hidden || hasPermission(currentUser, "reviews", "viewHidden", e)
  );
}

export async function getRestaurantReviewsByAuthorId(
  id: User["id"],
  take: number,
  skip?: number
): Promise<RestaurantReviewFull[]> {
  const currentUser = (await getCurrentUser()) || undefined;
  const result = await prisma.restaurantReview.findMany({
    where: {
      authorId: id,
    },
    include: {
      author: true,
      subject: true,
    },
    take: take,
    skip: skip,
  });
  return result.filter(
    (e) => !e.hidden || hasPermission(currentUser, "reviews", "viewHidden", e)
  );
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

export async function deleteRestaurantReview(id: string) {
  if (!currentUserHasPermission("reviews", "delete", { id: id })) return null;
  return await prisma.restaurantReview.delete({
    where: { id: id },
  });
}

export async function hideRestaurantReview(
  id: RestaurantReview["id"],
  hide: boolean
): Promise<RestaurantReview | null> {
  if (!currentUserHasPermission("reviews", "hide", { id: id })) return null;
  return await prisma.restaurantReview.update({
    where: {
      id: id,
    },
    data: {
      hidden: hide,
    },
  });
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
