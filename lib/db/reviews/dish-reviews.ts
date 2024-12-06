"use server";

import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/prisma";
import { currentUserHasPermission, getCurrentUser } from "@/utils/users";
import { Dish, DishReview, User } from "@prisma/client";

export type DishReviewCreator = Pick<
  DishReview,
  "content" | "subjectId" | "stars"
>;
export type DishReviewFull = DishReview & { subject: Dish; author: User };

export async function getDishReviewById(
  id: DishReview["id"]
): Promise<DishReviewFull | null> {
  const result = await prisma.dishReview.findFirst({
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

export async function getDishReviewsByAuthorId(
  id: User["id"],
  take: number,
  skip?: number
): Promise<DishReviewFull[]> {
  const currentUser = (await getCurrentUser()) || undefined;
  const result = await prisma.dishReview.findMany({
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

export async function deleteDishReview(id: string) {
  if (!currentUserHasPermission("reviews", "delete", { id: id })) return null;
  return await prisma.dishReview.delete({ where: { id: id } });
}

export async function hideDishReview(
  id: Dish["id"],
  hide: boolean
): Promise<DishReview | null> {
  if (!currentUserHasPermission("reviews", "hide", { id: id })) return null;
  return await prisma.dishReview.update({
    where: {
      id: id,
    },
    data: {
      hidden: hide,
    },
  });
}
