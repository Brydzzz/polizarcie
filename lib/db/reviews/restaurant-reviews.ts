"use server";

import { hasPermission } from "@/lib/permissions";
import { getProfanityGuard } from "@/lib/profanity";
import { prisma } from "@/prisma";
import { getCurrentUser } from "@/utils/users";
import { BaseReview, Restaurant, RestaurantReview, User } from "@prisma/client";
import { forbidden, unauthorized } from "next/navigation";
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
      images: true,
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
  if (!result) return result;
  if (result.baseData.hidden) {
    const currentUser = await getCurrentUser();
    if (!currentUser) unauthorized();
    if (!hasPermission(currentUser, "reviews", "viewHidden", result.baseData))
      forbidden();
  }
  return result;
}

export async function getRestaurantReviewsByRestaurantId(
  id: Restaurant["id"],
  take: number,
  skip?: number
): Promise<RestaurantReviewFull[]> {
  let result: RestaurantReviewFull[] = [];
  let toTake = take;
  let toSkip = skip || 0;
  const currentUser = (await getCurrentUser()) || undefined;
  if (currentUser) {
    const amountOwn = (
      await prisma.restaurantReview.aggregate({
        where: {
          baseData: {
            authorId: currentUser.id,
          },
        },
        _count: {
          id: true,
        },
      })
    )._count.id;
    if (amountOwn > toSkip) {
      const own = await prisma.restaurantReview.findMany({
        where: {
          subjectId: id,
          baseData: {
            authorId: currentUser.id,
          },
        },
        include: FULL_INCLUDE_PRESET,
        take: toTake,
        skip: toSkip,
        orderBy: [
          {
            baseData: {
              hidden: "asc",
            },
          },
          {
            baseData: {
              createdDate: "desc",
            },
          },
        ],
      });
      result = result.concat(own);
      toTake -= own.length;
      toSkip = 0;
    } else {
      toSkip -= amountOwn;
    }
  }
  toSkip = Math.max(0, toSkip);
  if (toTake > 0) {
    const notOwn = await prisma.restaurantReview.findMany({
      where: {
        subjectId: id,
        baseData: {
          NOT: {
            authorId: currentUser?.id || "",
          },
        },
      },
      include: FULL_INCLUDE_PRESET,
      take: toTake,
      skip: toSkip,
      orderBy: [
        {
          baseData: {
            hidden: "asc",
          },
        },
        {
          baseData: {
            likes: "desc",
          },
        },
      ],
    });
    result = result.concat(notOwn);
  }
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
    orderBy: [
      {
        baseData: {
          hidden: "asc",
        },
      },
      {
        baseData: {
          likes: "desc",
        },
      },
    ],
  });
  return result.filter(
    (e) =>
      !e.baseData.hidden ||
      hasPermission(currentUser, "reviews", "viewHidden", e.baseData)
  );
}

export async function createRestaurantReview(data: RestaurantReviewCreator) {
  const currentUser = await getCurrentUser();
  if (currentUser == null) unauthorized();
  if (!hasPermission(currentUser, "reviews", "create")) forbidden();
  const censoredContent = getProfanityGuard().censor(data.content);
  const review = await prisma.baseReview.create({
    data: {
      authorId: currentUser.id,
      restaurantReview: {
        create: {
          subjectId: data.subjectId,
          amountSpent: data.amountSpent,
          content: data.content,
          censoredContent: censoredContent,
          stars: data.stars,
        },
      },
    },
  });
  updateRestaurantStats(data.subjectId);
  return review;
}

export async function updateRestaurantReview(data: RestaurantReview) {
  const baseReview = (await getBaseReviewById(data.id)) || undefined;
  const currentUser = await getCurrentUser();
  if (currentUser == null) unauthorized();
  if (!hasPermission(currentUser, "reviews", "edit", baseReview)) forbidden();
  const censoredContent = getProfanityGuard().censor(data.content);
  const review = await prisma.restaurantReview.update({
    where: { id: data.id },
    data: {
      amountSpent: data.amountSpent,
      content: data.content,
      censoredContent: censoredContent,
      stars: data.stars,
    },
  });
  updateRestaurantStats(data.subjectId);
  return review;
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

export async function getRestaurantAvgAmountSpentById(id: Restaurant["id"]) {
  return await prisma.restaurantReview.aggregate({
    _avg: {
      amountSpent: true,
    },
    where: {
      subjectId: id,
    },
  });
}

export async function updateRestaurantAvgAmountSpentById(id: Restaurant["id"]) {
  const updatedAvgAmountSpent = await getRestaurantAvgAmountSpentById(id);
  const newAmountSpent = Number(
    updatedAvgAmountSpent._avg.amountSpent?.toFixed(2)
  );
  return await prisma.restaurant.update({
    where: { id: id },
    data: {
      averageAmountSpent: newAmountSpent,
    },
  });
}

export async function updateRestaurantAvgStarsById(id: Restaurant["id"]) {
  const updatedAvgStars = await getRestaurantAvgStarsById(id);
  const newAvgStars = Number(updatedAvgStars._avg.stars?.toFixed(2));
  return await prisma.restaurant.update({
    where: { id: id },
    data: {
      averageStars: newAvgStars,
    },
  });
}

export async function updateRestaurantStats(id: Restaurant["id"]) {
  await updateRestaurantAvgAmountSpentById(id);
  await updateRestaurantAvgStarsById(id);
}

// export async function deleteRestaurantReview(
//   reviewId: RestaurantReview["id"],
//   restaurantId: Restaurant["id"]
// ) {
//   await deleteReview(reviewId);
//   await updateRestaurantStats(restaurantId);
// }
