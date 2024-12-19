"use server";

import { prisma } from "@/prisma";
import { getCurrentUser } from "@/utils/users";
import { Address, Image, Restaurant } from "@prisma/client";
import { hasPermission } from "../permissions";
import { getImageByPath } from "./images";

const FULL_INCLUDE_PRESET = {
  address: true,
  images: true,
};

export type RestaurantFull = Restaurant & {
  address: Address | null;
  images: Image[];
};

export async function getAllRestaurants(): Promise<RestaurantFull[]> {
  const restaurants = await prisma.restaurant.findMany({
    include: FULL_INCLUDE_PRESET,
  });
  return restaurants;
}

export async function getRestaurantsLike(
  query: string
): Promise<RestaurantFull[]> {
  const restaurants = await prisma.restaurant.findMany({
    include: FULL_INCLUDE_PRESET,
    where: {
      OR: [
        {
          name: { contains: query, mode: "insensitive" },
        },
        { address: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
  });
  return restaurants;
}

export async function getRestaurantById(
  id: Restaurant["id"]
): Promise<RestaurantFull | null> {
  const data = await prisma.restaurant.findFirst({
    where: {
      id: id,
    },
    include: FULL_INCLUDE_PRESET,
  });
  return data;
}

export async function getRestaurantBySlug(
  slug: Restaurant["slug"]
): Promise<RestaurantFull | null> {
  const data = await prisma.restaurant.findUnique({
    where: {
      slug: slug,
    },
    include: FULL_INCLUDE_PRESET,
  });

  return data;
}

export async function getMenuByRestaurantId(id: Restaurant["id"]) {
  const data = await prisma.dish.findMany({
    select: {
      name: true,
      description: true,
      priceZl: true,
      priceGr: true,
      type: true,
    },
    where: {
      restaurantId: id,
    },
    orderBy: { type: "asc" },
  });
  return data;
}

export async function linkImageToRestaurant(
  restaurantId: Restaurant["id"],
  imagePath: Image["path"]
) {
  const uploadedById =
    (await getImageByPath(imagePath))?.uploadedById || undefined;
  if (!uploadedById) return null;
  const user = await getCurrentUser();
  if (user == null) return null;
  if (!hasPermission(user, "images", "link", { uploadedById: uploadedById }))
    return null;
  return await prisma.restaurant.update({
    where: {
      id: restaurantId,
    },
    data: {
      images: {
        connect: {
          path: imagePath,
        },
      },
    },
  });
}
