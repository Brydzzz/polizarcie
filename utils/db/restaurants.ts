"server only";

import { prisma } from "@/utils/prisma";

export async function fetchAllRestaurants() {
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

export async function fetchRestaurantsLike(like: string) {
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

export async function fetchRestaurantById(id: string) {
  const data = await prisma.restaurant.findUnique({
    where: {
      id: id,
    },
    include: {
      address: true,
    },
  });
  if (!data) {
    throw new Error(`Restaurant with ID ${id} not found`);
  }

  return JSON.stringify(data);
}
