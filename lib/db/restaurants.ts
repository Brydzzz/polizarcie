"use server";

import { prisma } from "@/prisma";
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

export async function getRestaurantBySlug(slug: string) {
  const data = await prisma.restaurant.findUnique({
    where: {
      slug: slug,
    },
    include: {
      address: true,
    },
  });

  return data;
}

export async function getMenuByRestaurantId(id: string) {
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
