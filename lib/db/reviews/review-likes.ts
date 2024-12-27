"use server";

import { prisma } from "@/prisma";
import { getCurrentUser } from "@/utils/users";
import { forbidden, unauthorized } from "next/navigation";
import { hasPermission } from "../../permissions";
import { getBaseReviewById } from "./base-reviews";

export async function addOrReplaceLikeForReview(
  reviewId: string,
  like: boolean
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) unauthorized();
  const baseReview = await getBaseReviewById(reviewId);
  if (!baseReview) return null;
  if (
    !hasPermission(currentUser, "reviews", "like", {
      authorId: baseReview.authorId,
    })
  )
    forbidden();
  const previous = (
    await prisma.reviewLike.findFirst({
      where: {
        reviewId: reviewId,
        authorId: currentUser.id,
      },
    })
  )?.like;
  if (like === previous) return null;
  if (previous !== undefined) {
    await prisma.baseReview.update({
      where: {
        id: reviewId,
      },
      data: previous
        ? { likes: baseReview.likes - 1, dislikes: baseReview.dislikes + 1 }
        : { likes: baseReview.likes + 1, dislikes: baseReview.dislikes - 1 },
    });
  } else {
    await prisma.baseReview.update({
      where: {
        id: reviewId,
      },
      data: like
        ? { likes: baseReview.likes + 1 }
        : { dislikes: baseReview.dislikes + 1 },
    });
  }

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
  if (!currentUser) unauthorized();
  const baseReview = await getBaseReviewById(reviewId);
  if (!baseReview) return null;
  if (
    !hasPermission(currentUser, "reviews", "like", {
      authorId: baseReview.authorId,
    })
  )
    forbidden();
  const previous =
    (
      await prisma.reviewLike.findFirst({
        where: {
          reviewId: reviewId,
          authorId: currentUser.id,
        },
      })
    )?.like || undefined;
  if (previous === undefined) return null;
  await prisma.baseReview.update({
    where: {
      id: reviewId,
    },
    data: previous
      ? { likes: baseReview.likes - 1 }
      : { dislikes: baseReview.dislikes - 1 },
  });
  return await prisma.reviewLike.delete({
    where: {
      authorId_reviewId: {
        reviewId: reviewId,
        authorId: currentUser.id,
      },
    },
  });
}
