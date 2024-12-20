"use server";

import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/prisma";
import { getCurrentUser } from "@/utils/users";
import { BaseReview, User } from "@prisma/client";
import { forbidden, unauthorized } from "next/navigation";

export type BaseReviewFull = {
  baseData: BaseReview & {
    author: User;
  };
};

export async function getBaseReviewById(id: BaseReview["id"]) {
  const currentUser = await getCurrentUser();
  if (currentUser == null) unauthorized();
  const baseReview = await prisma.baseReview.findFirst({
    where: {
      id: id,
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
  const currentUser = await getCurrentUser();
  if (currentUser == null) unauthorized();
  if (!hasPermission(currentUser, "reviews", "delete", baseReview)) forbidden();
  return await prisma.baseReview.delete({
    where: {
      id: id,
    },
  });
}
