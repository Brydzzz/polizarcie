"use server";

import { prisma } from "@/utils/prisma";
import { Restaurant } from "@prisma/client";

export async function getAllRestaurants() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      address: {
        select: {
          name: true,
        },
      },
    },
  });
  return restaurants;
}

export async function getRestaurantsLike(like: string) {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      address: {
        select: {
          name: true,
        },
      },
    },
    where: {
      OR: [
        {
          name: { contains: like, mode: "insensitive" },
        },
        { address: { name: { contains: like, mode: "insensitive" } } },
      ],
    },
  });
  return restaurants;
}

export async function getRestaurantById(id: Restaurant["id"]) {
  const data = await prisma.restaurant.findFirst({
    where: {
      id: id,
    },
  });
  return data;
}
