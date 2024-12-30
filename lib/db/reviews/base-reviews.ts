"use server";

import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/prisma";
import { getCurrentUser } from "@/utils/users";
import { BaseReview, Image, User } from "@prisma/client";
import { forbidden, unauthorized } from "next/navigation";
import { deleteImages, getImagesByPaths } from "../images";
import {
  getRestaurantReviewById,
  updateRestaurantStats,
} from "./restaurant-reviews";

export type BaseReviewFull = {
  baseData: BaseReview & {
    author: User;
    images: Image[];
  };
};

export async function getBaseReviewById(id: BaseReview["id"]) {
  const currentUser = await getCurrentUser();
  if (currentUser == null) unauthorized();
  const baseReview = await prisma.baseReview.findFirst({
    where: {
      id: id,
    },
    include: {
      author: true,
      images: true,
    },
  });
  if (!baseReview) return baseReview;
  if (
    baseReview?.hidden &&
    !hasPermission(currentUser, "reviews", "viewHidden", baseReview)
  )
    forbidden();
  return baseReview;
}

export async function hideReview(id: BaseReview["id"], hide: boolean) {
  const baseReview = (await getBaseReviewById(id)) || undefined;
  const currentUser = await getCurrentUser();
  if (currentUser == null) unauthorized();
  if (!hasPermission(currentUser, "reviews", "hide", baseReview)) forbidden();
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
  const baseReview = (await getBaseReviewById(id)) || undefined;
  if (!baseReview) return null;
  const currentUser = await getCurrentUser();
  if (currentUser == null) unauthorized();
  if (!hasPermission(currentUser, "reviews", "delete", baseReview)) forbidden();
  await deleteImages(baseReview.images.map((image) => image.path));
  // TODO: find a cleaner way to update restaurant stats
  const restaurantReview = await getRestaurantReviewById(id);
  const review = await prisma.baseReview.delete({
    where: {
      id: id,
    },
  });
  if (restaurantReview) {
    await updateRestaurantStats(restaurantReview.subjectId);
  }
  return review;
}

export async function linkImagesToReview(
  reviewId: BaseReview["id"],
  imagePaths: Image["path"][]
) {
  // permission check
  const user = await getCurrentUser();
  if (user == null) unauthorized();
  const images = await getImagesByPaths(imagePaths);
  if (
    !images.every((image) => {
      return hasPermission(user, "images", "delete", image);
    })
  )
    forbidden();

  // Try to connect
  return await prisma.baseReview.update({
    where: {
      id: reviewId,
    },
    data: {
      images: {
        connect: imagePaths.map((path) => ({ path: path })),
      },
    },
  });
}
