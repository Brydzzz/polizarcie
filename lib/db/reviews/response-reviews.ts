"use server";

import { hasPermission } from "@/lib/permissions";
import { getProfanityGuard } from "@/lib/profanity";
import { prisma } from "@/prisma";
import { getCurrentUser } from "@/utils/users";
import { BaseReview, Dish, ResponseReview, User } from "@prisma/client";
import { forbidden, unauthorized } from "next/navigation";
import { BaseReviewFull, getBaseReviewById } from "./base-reviews";

export type ResponseReviewCreator = Pick<
  ResponseReview,
  "content" | "subjectId"
>;
export type ResponseReviewFull = ResponseReview &
  BaseReviewFull & { subject: BaseReview };

const FULL_INCLUDE_PRESET = {
  baseData: {
    include: {
      author: true,
      images: true,
    },
  },
  subject: true,
};

export async function getResponseReviewById(
  id: ResponseReview["id"]
): Promise<ResponseReviewFull | null> {
  const result = await prisma.responseReview.findFirst({
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

export async function getResponseReviewsByReviewId(
  id: Dish["id"],
  take: number,
  skip?: number
): Promise<ResponseReviewFull[]> {
  let result: ResponseReviewFull[] = [];
  let toTake = take;
  let toSkip = skip || 0;
  const currentUser = (await getCurrentUser()) || undefined;
  if (currentUser) {
    const amountOwn = (
      await prisma.responseReview.aggregate({
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
      const own = await prisma.responseReview.findMany({
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
    const notOwn = await prisma.responseReview.findMany({
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

export async function getResponseReviewsByAuthorId(
  id: User["id"],
  take: number,
  skip?: number
): Promise<ResponseReviewFull[]> {
  const currentUser = (await getCurrentUser()) || undefined;
  const result = await prisma.responseReview.findMany({
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

export async function createResponseReview(data: ResponseReviewCreator) {
  const currentUser = await getCurrentUser();
  if (currentUser == null) unauthorized();
  if (!hasPermission(currentUser, "reviews", "create")) forbidden();
  const censoredContent = getProfanityGuard().censor(data.content);
  return await prisma.baseReview.create({
    data: {
      authorId: currentUser.id,
      responseReview: {
        create: {
          subjectId: data.subjectId,
          content: data.content,
          censoredContent: censoredContent,
        },
      },
    },
  });
}

export async function updateResponseReview(data: ResponseReview) {
  const baseReview = (await getBaseReviewById(data.id)) || undefined;
  const currentUser = await getCurrentUser();
  if (currentUser == null) unauthorized();
  if (!hasPermission(currentUser, "reviews", "edit", baseReview)) forbidden();
  const censoredContent = getProfanityGuard().censor(data.content);
  return await prisma.responseReview.update({
    where: { id: data.id },
    data: {
      content: data.content,
      censoredContent: censoredContent,
    },
  });
}
