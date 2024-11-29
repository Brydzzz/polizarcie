"use server";

import { prisma } from "@/utils/prisma";

export async function get_all_restaurants() {
  const restaurants = await prisma.restaurant.findMany();
  return restaurants;
}

export async function get_restaurants_like(like: string) {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      name: { contains: like, mode: "insensitive" },
    },
  });
  return restaurants;
}

export async function get_restaurant_by_id(id: number) {
  const data = await prisma.restaurant.findUnique({
    where: {
      restaurant_id: id,
    },
    include: {
      address: true,
    },
  });
  if (!data) {
    throw new Error(`Restaurant with ID ${id} not found`);
  }
  return data;
}
