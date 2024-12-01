import {
  createDishReview,
  createRestaurantReview,
  deleteDishReview,
  deleteRestaurantReview,
  getDishReviewsByDishId,
  getRestaurantReviewsByRestaurantId,
  updateDishReview,
  updateRestaurantReview,
} from "@/lib/db/reviews";
import { Dish, DishReview, Restaurant, RestaurantReview } from "@prisma/client";
import { getDishById } from "../../lib/db/dishes";
import { getRestaurantById } from "../../lib/db/restaurants";

export type ReviewType = {
  restaurant: {
    subject: Restaurant;
    data: RestaurantReview;
  };
  dish: {
    subject: Dish;
    data: DishReview;
  };
};

type ReviewFactory = {
  [Key in keyof ReviewType]: {
    getBySubjectId: (
      id: ReviewType[Key]["subject"]["id"]
    ) => Promise<ReviewType[Key]["data"][]>;
    getSubject: (
      by: ReviewType[Key]["data"] | ReviewType[Key]["subject"]["id"]
    ) => Promise<ReviewType[Key]["subject"] | null>;
    create: (
      data: ReviewType[Key]["data"]
    ) => Promise<ReviewType[Key]["data"] | null>;
    edit: (
      data: ReviewType[Key]["data"]
    ) => Promise<ReviewType[Key]["data"] | null>;
    delete: (
      id: ReviewType[Key]["data"]["id"]
    ) => Promise<ReviewType[Key]["data"] | null>;
  };
};

export const REVIEW_FACTORY: ReviewFactory = {
  restaurant: {
    getBySubjectId: getRestaurantReviewsByRestaurantId,
    getSubject: async (by) =>
      await getRestaurantById(typeof by === "string" ? by : by.restaurantId),
    create: createRestaurantReview,
    edit: updateRestaurantReview,
    delete: deleteRestaurantReview,
  },
  dish: {
    getBySubjectId: getDishReviewsByDishId,
    getSubject: async (by) =>
      await getDishById(typeof by === "string" ? by : by.dishId),
    create: createDishReview,
    edit: updateDishReview,
    delete: deleteDishReview,
  },
};
