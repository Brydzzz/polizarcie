"use server";

import { prisma } from "@/prisma";
import { Dish, Restaurant } from "@prisma/client";
import { getRestaurantBySlug } from "./restaurants";

export async function getDishById(id: Dish["id"]) {
  return await prisma.dish.findFirst({
    where: { id: id },
  });
}

export async function getDishBySlugs(
  restaurantSlug: Restaurant["slug"],
  dishSlug: Dish["slug"]
) {
  const restaurant = await getRestaurantBySlug(restaurantSlug);
  if (!restaurant) return restaurant;
  return await prisma.dish.findFirst({
    where: { AND: [{ restaurantId: restaurant.id }, { slug: dishSlug }] },
  });
}
