"use server";

import { prisma } from "@/utils/prisma";
import { Restaurant } from "@prisma/client";

export async function getRestaurantReviews(id: string) {
  const reviews = await prisma.restaurantReview.findMany({
    where: {
      restaurantId: id,
    },
  });
  return JSON.stringify(reviews);
}

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
      price: true,
      type: true,
    },
    where: {
      restaurantId: id,
    },
    orderBy: { type: "asc" },
  });
  return data;
}
