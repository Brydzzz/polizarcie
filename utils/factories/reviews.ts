import {
  createDishReview,
  createRestaurantReview,
  deleteDishReview,
  deleteRestaurantReview,
  getDishReviewsByDishId,
  getRestaurantReviewsByRestaurantId,
  updateDishReview,
  updateRestaurantReview,
} from "@/utils/db/reviews";
import { Dish, DishReview, Restaurant, RestaurantReview } from "@prisma/client";
import { getDishById } from "../db/dishes";
import { getRestaurantById } from "../db/restaurants";

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
      data: ReviewType[Key]["data"]
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
    getSubject: async (data) => await getRestaurantById(data.restaurantId),
    create: createRestaurantReview,
    edit: updateRestaurantReview,
    delete: deleteRestaurantReview,
  },
  dish: {
    getBySubjectId: getDishReviewsByDishId,
    getSubject: async (data) => await getDishById(data.dishId),
    create: createDishReview,
    edit: updateDishReview,
    delete: deleteDishReview,
  },
};
