"use server";

import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/prisma";
import { currentUserHasPermission, getCurrentUser } from "@/utils/users";
import { BaseReview, Restaurant, RestaurantReview, User } from "@prisma/client";
import { BaseReviewFull, getBaseReviewById } from "./base-reviews";

export type RestaurantReviewCreator = Pick<
  RestaurantReview,
  "amountSpent" | "content" | "subjectId" | "stars"
>;
export type RestaurantReviewFull = RestaurantReview &
  BaseReviewFull & {
    subject: Restaurant;
  };

const FULL_INCLUDE_PRESET = {
  baseData: {
    include: {
      author: true,
    },
  },
  subject: true,
};

export async function getRestaurantReviewById(
  id: BaseReview["id"]
): Promise<RestaurantReviewFull | null> {
  const result = await prisma.restaurantReview.findFirst({
    where: {
      id: id,
    },
    include: FULL_INCLUDE_PRESET,
  });
  return !result
    ? result
    : !result.baseData.hidden ||
      (await currentUserHasPermission("reviews", "viewHidden", result.baseData))
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
    include: FULL_INCLUDE_PRESET,
    take: take,
    skip: skip,
  });
  return result.filter(
    (e) =>
      !e.baseData.hidden ||
      hasPermission(currentUser, "reviews", "viewHidden", e.baseData)
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
      baseData: {
        authorId: id,
      },
    },
    include: FULL_INCLUDE_PRESET,
    take: take,
    skip: skip,
  });
  return result.filter(
    (e) =>
      !e.baseData.hidden ||
      hasPermission(currentUser, "reviews", "viewHidden", e.baseData)
  );
}

export async function createRestaurantReview(data: RestaurantReviewCreator) {
  if (!currentUserHasPermission("reviews", "create")) return null;
  const user = await getCurrentUser();
  if (user == null) return null;
  return await prisma.baseReview.create({
    data: {
      authorId: user.id,
      restaurantReview: {
        create: {
          subjectId: data.subjectId,
          amountSpent: data.amountSpent,
          content: data.content,
          stars: data.stars,
        },
      },
    },
  });
}

export async function updateRestaurantReview(data: RestaurantReview) {
  const authorId = (await getBaseReviewById(data.id))?.authorId || undefined;
  if (!currentUserHasPermission("reviews", "edit", { authorId: authorId }))
    return null;
  return await prisma.restaurantReview.update({
    where: { id: data.id },
    data: {
      amountSpent: data.amountSpent,
      content: data.content,
      stars: data.stars,
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
