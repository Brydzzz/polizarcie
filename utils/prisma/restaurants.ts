"use server";

import { prisma } from "@/utils/prisma";

export async function get_all_restaurants() {
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

export async function get_restaurants_like(like: string) {
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
