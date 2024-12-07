"use server";

import { prisma } from "@/prisma";
import { currentUserHasPermission } from "@/utils/users";
import { BaseReview, User } from "@prisma/client";

export type BaseReviewFull = {
  baseData: BaseReview & {
    author: User;
  };
};

export async function getBaseReviewById(id: BaseReview["id"]) {
  if (!currentUserHasPermission("reviews", "hide", { id: id })) return null;
  return await prisma.baseReview.findFirst({
    where: {
      id: id,
    },
  });
}

export async function hideReview(id: BaseReview["id"], hide: boolean) {
  const authorId = (await getBaseReviewById(id))?.authorId || undefined;
  if (!currentUserHasPermission("reviews", "hide", { authorId: authorId }))
    return null;
  return await prisma.baseReview.update({
    where: {
      id: id,
    },
    data: {
      hidden: hide,
    },
  });
}

export async function deleteReview(id: BaseReview["id"]) {
  const authorId = (await getBaseReviewById(id))?.authorId || undefined;
  if (!currentUserHasPermission("reviews", "delete", { authorId: authorId }))
    return null;
  return await prisma.baseReview.delete({
    where: {
      id: id,
    },
  });
}
