"use server";

import { prisma } from "@/prisma";
import { forbidden, unauthorized } from "@/utils/misc";
import { getCurrentUser } from "@/utils/users";
import {
  Gender,
  Image,
  MatchRequest,
  Restaurant,
  User,
  UserMedia,
} from "@prisma/client";
import { hasPermission } from "../permissions";
import { deleteImages, getImagesByPaths } from "./images";
import {
  clearUserPasswordCache,
  updateUserPasswordFromCache,
} from "./users.server-only";

export type UserFull = User & {
  medias: UserMedia[];
};

export async function getUserById(id: User["id"]): Promise<UserFull | null> {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
    include: {
      medias: true,
    },
  });
}

export async function getUnmatchedUser(user: User, excludeIds: User["id"][]) {
  return await prisma.user.findFirst({
    where: {
      id: { not: user.id },
      preferredGender: user.gender,
      gender: user.preferredGender,
      meetingStatus: true,
      AND: [
        {
          userOneMatch: {
            none: {
              OR: [
                { userOneId: user.id },
                { userTwoId: user.id },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          userTwoMatch: {
            none: {
              OR: [
                { userOneId: user.id },
                { userTwoId: user.id },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          id: { notIn: excludeIds },
        },
      ],
    },
  });
}

export async function getUnmatchedSimilarUser(
  user: User,
  excludeIds: User["id"][]
) {
  return await prisma.user.findFirst({
    where: {
      id: { not: user.id },
      preferredGender: user.gender,
      gender: user.preferredGender,
      meetingStatus: true,
      AND: [
        {
          favoriteRestaurants: {
            some: {
              userId: user.id,
            },
          },
        },
        {
          userOneMatch: {
            none: {
              OR: [
                { userOneId: user.id },
                { userTwoId: user.id },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          userTwoMatch: {
            none: {
              OR: [
                { userOneId: user.id },
                { userTwoId: user.id },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          id: { notIn: excludeIds },
        },
      ],
    },
  });
}

export async function getUsersMatchedWith(userId: User["id"]) {
  return await prisma.user.findMany({
    where: {
      id: { not: userId },
      OR: [
        {
          userOneMatch: {
            some: {
              AND: [
                { OR: [{ userOneId: userId }, { userTwoId: userId }] },
                { value: MatchRequest.ACCEPTED },
              ],
            },
          },
        },
        {
          userTwoMatch: {
            some: {
              AND: [
                { OR: [{ userOneId: userId }, { userTwoId: userId }] },
                { value: MatchRequest.ACCEPTED },
              ],
            },
          },
        },
      ],
    },
    include: {
      medias: true,
    },
  });
}

export async function getUsersPendingWith(userId: User["id"]) {
  return await prisma.user.findMany({
    where: {
      id: { not: userId },

      userTwoMatch: {
        some: {
          userOneId: userId,
          value: MatchRequest.PENDING,
        },
      },
    },
  });
}
export async function turnOnMeeting(userId: User["id"]) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      meetingStatus: true,
    },
  });
}

export async function getUnmatchedSimilarUsers(
  user: User,
  excludeIds: User["id"][],
  howMany: number
) {
  return await prisma.user.findMany({
    take: howMany,
    where: {
      id: { not: user.id },
      preferredGender: user.gender,
      gender: user.preferredGender,
      meetingStatus: true,
      AND: [
        {
          favoriteRestaurants: {
            some: {
              restaurant: {
                favoriteAmong: {
                  some: {
                    userId: user.id,
                  },
                },
              },
            },
          },
        },
        {
          userOneMatch: {
            none: {
              OR: [
                { userOneId: user.id },
                { userTwoId: user.id },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          userTwoMatch: {
            none: {
              OR: [
                { userOneId: user.id },
                { userTwoId: user.id },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          id: { notIn: excludeIds },
        },
      ],
    },
  });
}

export async function getUnmatchedUsers(
  user: User,
  excludeIds: User["id"][],
  howMany: number
) {
  return await prisma.user.findMany({
    take: howMany,
    where: {
      id: { not: user.id },
      preferredGender: user.gender,
      gender: user.preferredGender,
      meetingStatus: true,
      AND: [
        {
          userOneMatch: {
            none: {
              OR: [
                { userOneId: user.id },
                { userTwoId: user.id },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          userTwoMatch: {
            none: {
              OR: [
                { userOneId: user.id },
                { userTwoId: user.id },
                { userOneId: { in: excludeIds } },
                { userTwoId: { in: excludeIds } },
              ],
            },
          },
        },
        {
          id: { notIn: excludeIds },
        },
      ],
    },
  });
}

export async function addRestaurantToLiked(restaurantId: Restaurant["id"]) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return unauthorized();
  const currentHighest = await prisma.userFavoriteRestaurant.findFirst({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      rankingPosition: "desc",
    },
  });
  const pos = currentHighest ? currentHighest.rankingPosition + 1 : 1;
  return await prisma.userFavoriteRestaurant.create({
    data: {
      userId: currentUser.id,
      restaurantId: restaurantId,
      rankingPosition: pos,
    },
  });
}

export async function removeRestaurantFromLiked(
  restaurantId: Restaurant["id"]
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return unauthorized();
  return await prisma.userFavoriteRestaurant.delete({
    where: {
      userId_restaurantId: {
        userId: currentUser.id,
        restaurantId: restaurantId,
      },
    },
  });
}

export async function isRestaurantLiked(restaurantId: Restaurant["id"]) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return unauthorized();
  return (
    (await prisma.userFavoriteRestaurant.findFirst({
      where: {
        userId: currentUser.id,
        restaurantId: restaurantId,
      },
    })) != null
  );
}

export async function getTopLikedRests(userId: User["id"]) {
  const liked = await prisma.restaurant.findMany({
    take: 3,
    where: {
      favoriteAmong: {
        some: {
          userId: userId,
          rankingPosition: { in: [1, 2, 3] },
        },
      },
    },
    include: {
      favoriteAmong: true,
    },
  });
  return liked.sort((a, b) => {
    const aRanking = a.favoriteAmong[0]?.rankingPosition ?? Infinity;
    const bRanking = b.favoriteAmong[0]?.rankingPosition ?? Infinity;
    return aRanking - bRanking;
  });
}

export async function getSimilarRestsLike(
  ogUserId: User["id"],
  newUserId: User["id"]
) {
  const liked = await prisma.restaurant.findMany({
    where: {
      AND: [
        {
          favoriteAmong: {
            some: {
              userId: ogUserId,
            },
          },
        },
        {
          favoriteAmong: {
            some: {
              userId: newUserId,
            },
          },
        },
      ],
    },
    include: {
      favoriteAmong: true,
    },
  });
  return liked.sort((a, b) => {
    const aRanking = a.favoriteAmong[0]?.rankingPosition ?? Infinity;
    const bRanking = b.favoriteAmong[0]?.rankingPosition ?? Infinity;
    return aRanking - bRanking;
  });
}

export async function getTopLikedRestsForUsers(usersIDs: User["id"][]) {
  return await Promise.all(
    usersIDs.map(async (userId) => {
      const userTopLiked = await prisma.restaurant.findMany({
        take: 3,
        where: {
          favoriteAmong: {
            some: {
              userId: userId,
              rankingPosition: { in: [1, 2, 3] },
            },
          },
        },
        include: {
          favoriteAmong: true,
        },
      });
      return userTopLiked.sort((a, b) => {
        const aRanking = a.favoriteAmong[0]?.rankingPosition ?? Infinity;
        const bRanking = b.favoriteAmong[0]?.rankingPosition ?? Infinity;
        return aRanking - bRanking;
      });
    })
  );
}

export async function getSimilarRestsForUsers(
  ogUserId: User["id"],
  usersIDs: User["id"][]
) {
  return await Promise.all(
    usersIDs.map(async (userId) => {
      const userTopLiked = await prisma.restaurant.findMany({
        where: {
          AND: [
            {
              favoriteAmong: {
                some: {
                  userId: ogUserId,
                },
              },
            },
            {
              favoriteAmong: {
                some: {
                  userId: userId,
                },
              },
            },
          ],
        },
        include: {
          favoriteAmong: true,
        },
      });
      return userTopLiked.sort((a, b) => {
        const aRanking = a.favoriteAmong[0]?.rankingPosition ?? Infinity;
        const bRanking = b.favoriteAmong[0]?.rankingPosition ?? Infinity;
        return aRanking - bRanking;
      });
    })
  );
}

export async function getUserByEmail(
  email: User["email"]
): Promise<UserFull | null> {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
    include: {
      medias: true,
    },
  });
}

export async function updateUserLastVerificationMail(id: User["id"]) {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      lastVerificationMail: new Date(),
    },
  });
}

export async function confirmPasswordChange() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return unauthorized();
  const result = await updateUserPasswordFromCache(currentUser.id);
  if (result) await clearUserPasswordCache(currentUser.id);
  return result;
}

export async function cancelPasswordChange() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return unauthorized();
  return await clearUserPasswordCache(currentUser.id);
}

export async function updateUserSettings(settings: {
  name?: string;
  description?: string;
  gender?: Gender;
  preferredGender?: Gender;
  meetingStatus?: boolean;
}) {
  const currentUser = await getCurrentUser();
  if (currentUser == null) return unauthorized();
  return await prisma.user.update({
    where: { id: currentUser.id },
    data: settings,
  });
}

export async function getUserMedias(id: User["id"]) {
  return await prisma.userMedia.findMany({
    where: {
      userId: id,
    },
  });
}

export async function updateUserMedias(
  medias: { type: UserMedia["type"]; link: string }[]
) {
  const currentUser = await getCurrentUser();
  if (currentUser == null) return unauthorized();
  return await Promise.all(
    medias
      .filter((media) => media.link.trim() !== "")
      .map(
        async (media) =>
          await prisma.userMedia.upsert({
            where: {
              userId_type: {
                userId: currentUser.id,
                type: media.type,
              },
            },
            update: {
              link: media.link,
            },
            create: {
              userId: currentUser.id,
              type: media.type,
              link: media.link,
            },
          })
      )
  );
}

export async function linkProfileImage(imagePath: Image["path"]) {
  // permission check
  const currentUser = await getCurrentUser();
  if (currentUser == null) return unauthorized();
  const images = await getImagesByPaths([imagePath]);
  if (
    !images.every((image) => {
      return hasPermission(currentUser, "images", "link", image);
    })
  )
    return forbidden();

  // remove previous if exists
  if (currentUser.localProfileImagePath)
    await deleteImages([currentUser.localProfileImagePath]);

  // Try to connect
  return await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      localProfileImage: {
        connect: { path: imagePath },
      },
    },
  });
}

export async function getUserFavoritesRestaurants(id: User["id"]) {
  return await prisma.userFavoriteRestaurant.findMany({
    where: {
      userId: id,
    },
  });
}

export async function updateUserFavoriteRestaurants(userId: User["id"], data: {
  restaurantId: Restaurant["id"];
  rankingPosition: number;
}[]) {
  return await Promise.all(
    data.map(async (favorite) => {
      return await prisma.userFavoriteRestaurant.upsert({
        where: {
          userId_restaurantId: {
            userId: userId,
            restaurantId: favorite.restaurantId,
          },
        },
        update: {
          rankingPosition: favorite.rankingPosition,
        },
        create: {
          userId: userId,
          restaurantId: favorite.restaurantId,
          rankingPosition: favorite.rankingPosition,
        },
      });
    })
  );
}

