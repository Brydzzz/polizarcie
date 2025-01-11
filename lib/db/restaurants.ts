"use server";

import { Filters } from "@/components/modals/filter-modal.component";
import { prisma } from "@/prisma";
import { getDistance } from "@/utils/coordinates/distance";
import { forbidden, unauthorized } from "@/utils/misc";
import { isRestaurantOpen } from "@/utils/restaurants";
import { getCurrentUser } from "@/utils/users";
import { Address, Image, Restaurant } from "@prisma/client";
import { hasPermission } from "../permissions";
import { getImagesByPaths } from "./images";

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
  let orderBy: {
    [key: string]:
      | "asc"
      | "desc"
      | { sort: "asc" | "desc"; nulls: "first" | "last" };
  } = {};
  switch (filters.sortOption) {
    case "name-asc":
      orderBy = { name: "asc" };
      break;
    case "rating-asc":
      orderBy = { averageStars: { sort: "asc", nulls: "first" } };
      break;
    case "price-asc":
      orderBy = { averageAmountSpent: { sort: "asc", nulls: "first" } };
      break;
    case "name-desc":
      orderBy = { name: "desc" };
      break;
    case "rating-desc":
      orderBy = { averageStars: { sort: "desc", nulls: "last" } };
      break;
    case "price-desc":
      orderBy = { averageAmountSpent: { sort: "desc", nulls: "last" } };
      break;
  }

  const restaurants = await prisma.restaurant.findMany({
    include: FULL_INCLUDE_PRESET,
    where: {
      OR: [
        {
          name: { contains: query, mode: "insensitive" },
        },
        { address: { name: { contains: query, mode: "insensitive" } } },
      ],
      AND: [
        {
          OR: [
            {
              averageAmountSpent: {
                gte: filters.priceRange.min,
                lte: filters.priceRange.max,
              },
            },
            { averageAmountSpent: null },
          ],
        },
        {
          OR: [
            {
              averageStars: {
                gte: filters.minRating,
              },
            },
            { averageStars: null },
          ],
        },
      ],
    },
    orderBy: orderBy,
  });

  const results = await Promise.all(
    restaurants.map(async (restaurant) => {
      // distance filter
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
        if (distanceTo > filters.facultyDistance) {
          return null;
        }
      }

      // isOpen filter
      if (filters.isOpen && !isRestaurantOpen(restaurant)) {
        return null;
      }

      // Handle null values
      const priceFiltersOff =
        filters.priceRange.min == 0 && filters.priceRange.max == 100;
      if (!priceFiltersOff && !restaurant.averageAmountSpent) {
        return null;
      }
      if (!restaurant.averageStars && filters.minRating !== 1) {
        return null;
      }

      return restaurant;
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

export async function getRestaurantNameById(id: Restaurant["id"]) {
  const data = await prisma.restaurant.findFirst({
    where: {
      id: id,
    },
    select: {
      name: true,
    },
  });
  return data?.name;
}

export async function getMenuByRestaurantId(id: Restaurant["id"]) {
  const data = await prisma.dish.findMany({
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
  if (user == null) return unauthorized();
  const images = await getImagesByPaths(imagePaths);
  if (
    !images.every((image) => {
      return hasPermission(user, "images", "link", image);
    })
  )
    return forbidden();

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
