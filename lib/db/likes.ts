"use server";

import { prisma } from "@/prisma";
import { currentUserHasPermission, getCurrentUser } from "@/utils/users";
import { hasPermission } from "../permissions";

export async function getLikesSumByReviewId(id: string) {
  if (!currentUserHasPermission("reviews", "view", { id: id })) return null;
  const likes = (
    await prisma.reviewLike.aggregate({
      _count: {
        like: true,
      },
      where: {
        reviewId: id,
        like: true,
      },
    })
  )._count.like;
  const dislikes = (
    await prisma.reviewLike.aggregate({
      _count: {
        like: true,
      },
      where: {
        reviewId: id,
        like: false,
      },
    })
  )._count.like;
  return { likes, dislikes };
}

export async function addOrReplaceLikeForReview(
  reviewId: string,
  like: boolean
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  if (!hasPermission(currentUser, "reviews", "like")) return null;
  return await prisma.reviewLike.upsert({
    where: {
      authorId_reviewId: {
        reviewId: reviewId,
        authorId: currentUser.id,
      },
    },
    update: {
      like: like,
    },
    create: {
      reviewId: reviewId,
      authorId: currentUser.id,
      like: like,
    },
  });
}

export async function removeLikeForReview(reviewId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  if (!hasPermission(currentUser, "reviews", "like", { id: reviewId }))
    return null;
  return await prisma.reviewLike.delete({
    where: {
      authorId_reviewId: {
        reviewId: reviewId,
        authorId: currentUser.id,
      },
    },
  });
}
