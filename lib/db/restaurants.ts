"use server";

import { Filters } from "@/components/modals/filter-modal.component";
import { prisma } from "@/prisma";
import { getDistance } from "@/utils/coordinates/distance";
import { getCurrentUser } from "@/utils/users";
import { Address, Image, Restaurant } from "@prisma/client";
import { forbidden, unauthorized } from "next/navigation";
import { hasPermission } from "../permissions";
import { getImagesByPaths } from "./images";
import {
  getRestaurantAvgAmountSpentById,
  getRestaurantAvgStarsById,
} from "./reviews/restaurant-reviews";

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
  query: string,
  filters: Filters
): Promise<RestaurantFull[]> {
  console.log(`Search started with query:, ${query}`);
  console.log(`Filters:, ${JSON.stringify(filters)}`);
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
  console.log(`"Found restaurants:", ${restaurants.length}`);
  const MAX_DISTANCE = 500;
  const results = await Promise.all(
    restaurants.map(async (restaurant) => {
      const [avgStars, avgPrice] = await Promise.all([
        getRestaurantAvgStarsById(restaurant.id),
        getRestaurantAvgAmountSpentById(restaurant.id),
      ]);

      const stars = avgStars._avg.stars || 0;
      const price = avgPrice._avg.amountSpent || 0;
      if (
        filters.faculty.x &&
        filters.faculty.y &&
        restaurant.address?.xCoords &&
        restaurant.address?.yCoords
      ) {
        const distanceTo = getDistance(
          filters.faculty.y,
          filters.faculty.x,
          Number(restaurant.address?.yCoords),
          Number(restaurant.address?.xCoords)
        );
        console.log(`Distance ${distanceTo}`);
        if (distanceTo > MAX_DISTANCE) {
          console.log(`Skipping restaurant:, ${restaurant.name}`);
          return null;
        }
      }
      console.log(
        `Restaurant: ${restaurant.name}, AvgStars: ${stars}, AvgPrice: ${price},`
      );
      if (
        stars >= filters.minRating &&
        price >= filters.priceRange.min &&
        price <= filters.priceRange.max
      ) {
        console.log(
          `Adding restaurant: ${restaurant.name} x:${restaurant.address?.xCoords} y:${restaurant.address?.yCoords}`
        );
        return restaurant;
      }
      console.log(`Skipping restaurant:, ${restaurant.name}`);
      return null;
    })
  );

  const filteredResults = results.filter(
    (restaurant) => restaurant !== null
  ) as RestaurantFull[];
  return filteredResults;
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

export async function linkImagesToRestaurant(
  restaurantId: Restaurant["id"],
  imagePaths: Image["path"][]
) {
  // permission check
  const user = await getCurrentUser();
  if (user == null) unauthorized();
  const images = await getImagesByPaths(imagePaths);
  if (
    !images.every((image) => {
      return hasPermission(user, "images", "delete", image);
    })
  )
    forbidden();

  // Try to connect
  return await prisma.restaurant.update({
    where: {
      id: restaurantId,
    },
    data: {
      images: {
        connect: imagePaths.map((path) => ({ path: path })),
      },
    },
  });
}
