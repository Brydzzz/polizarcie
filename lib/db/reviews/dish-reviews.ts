"use server";

import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/prisma";
import { currentUserHasPermission, getCurrentUser } from "@/utils/users";
import { Dish, DishReview, User } from "@prisma/client";
import { BaseReviewFull, getBaseReviewById } from "./base-reviews";

export type DishReviewCreator = Pick<
  DishReview,
  "content" | "subjectId" | "stars"
>;
export type DishReviewFull = DishReview & BaseReviewFull & { subject: Dish };

const FULL_INCLUDE_PRESET = {
  baseData: {
    include: {
      author: true,
    },
  },
  subject: true,
};

export async function getDishReviewById(
  id: DishReview["id"]
): Promise<DishReviewFull | null> {
  const result = await prisma.dishReview.findFirst({
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

export async function getDishReviewsByDishId(
  id: Dish["id"],
  take: number,
  skip?: number
): Promise<DishReviewFull[]> {
  const currentUser = (await getCurrentUser()) || undefined;
  const result = await prisma.dishReview.findMany({
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

export async function getDishReviewsByAuthorId(
  id: User["id"],
  take: number,
  skip?: number
): Promise<DishReviewFull[]> {
  const currentUser = (await getCurrentUser()) || undefined;
  const result = await prisma.dishReview.findMany({
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

export async function createDishReview(data: DishReviewCreator) {
  if (!currentUserHasPermission("reviews", "create")) return null;
  const user = await getCurrentUser();
  if (user == null) return null;
  return await prisma.baseReview.create({
    data: {
      authorId: user.id,
      dishReview: {
        create: {
          subjectId: data.subjectId,
          content: data.content,
          stars: data.stars,
        },
      },
    },
  });
}

export async function updateDishReview(data: DishReview) {
  const authorId = (await getBaseReviewById(data.id))?.authorId || undefined;
  if (!currentUserHasPermission("reviews", "edit", { authorId: authorId }))
    return null;
  return await prisma.dishReview.update({
    where: { id: data.id },
    data: {
      content: data.content,
      stars: data.stars,
    },
  });
}
