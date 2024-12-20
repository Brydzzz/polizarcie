"use server";

import { hasPermission } from "@/lib/permissions";
import { getProfanityGuard } from "@/lib/profanity";
import { prisma } from "@/prisma";
import { getCurrentUser } from "@/utils/users";
import { Dish, DishReview, User } from "@prisma/client";
import { forbidden, unauthorized } from "next/navigation";
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
  if (!result) return result;
  if (result.baseData.hidden) {
    const currentUser = await getCurrentUser();
    if (!currentUser) unauthorized();
    if (!hasPermission(currentUser, "reviews", "viewHidden", result.baseData))
      forbidden();
  }
  return result;
}

export async function getDishReviewsByDishId(
  id: Dish["id"],
  take: number,
  skip?: number
): Promise<DishReviewFull[]> {
  let result: DishReviewFull[] = [];
  let toTake = take;
  let toSkip = skip || 0;
  const currentUser = (await getCurrentUser()) || undefined;
  if (currentUser) {
    const amountOwn = (
      await prisma.dishReview.aggregate({
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
      const own = await prisma.dishReview.findMany({
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
    const notOwn = await prisma.dishReview.findMany({
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

export async function createDishReview(data: DishReviewCreator) {
  const currentUser = await getCurrentUser();
  if (currentUser == null) unauthorized();
  if (!hasPermission(currentUser, "reviews", "create")) forbidden();
  const censoredContent = getProfanityGuard().censor(data.content);
  return await prisma.baseReview.create({
    data: {
      authorId: currentUser.id,
      dishReview: {
        create: {
          subjectId: data.subjectId,
          content: data.content,
          censoredContent: censoredContent,
          stars: data.stars,
        },
      },
    },
  });
}

export async function updateDishReview(data: DishReview) {
  const baseReview = (await getBaseReviewById(data.id)) || undefined;
  const currentUser = await getCurrentUser();
  if (currentUser == null) unauthorized();
  if (!hasPermission(currentUser, "reviews", "edit", baseReview)) forbidden();
  const censoredContent = getProfanityGuard().censor(data.content);
  return await prisma.dishReview.update({
    where: { id: data.id },
    data: {
      content: data.content,
      censoredContent: censoredContent,
      stars: data.stars,
    },
  });
}
