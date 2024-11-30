"use server";

import {
  fetchAllRestaurants,
  fetchRestaurantsLike,
} from "@/utils/db/restaurants";

export async function getAllRestaurants() {
  return fetchAllRestaurants();
}

export async function getRestaurantsLike(name: string) {
  return fetchRestaurantsLike(name);
}
