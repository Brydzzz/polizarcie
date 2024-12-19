import {
  createDishReview,
  DishReviewCreator,
  DishReviewFull,
  getDishReviewById,
  getDishReviewsByAuthorId,
  getDishReviewsByDishId,
  updateDishReview,
} from "@/lib/db/reviews/dish-reviews";
import {
  createRestaurantReview,
  getRestaurantReviewById,
  getRestaurantReviewsByAuthorId,
  getRestaurantReviewsByRestaurantId,
  RestaurantReviewCreator,
  RestaurantReviewFull,
  updateRestaurantReview,
} from "@/lib/db/reviews/restaurant-reviews";
import {
  BaseReview,
  Dish,
  DishReview,
  Restaurant,
  RestaurantReview,
} from "@prisma/client";
import { getDishById } from "../../lib/db/dishes";
import { getRestaurantById } from "../../lib/db/restaurants";
import { transferWithJSON } from "../misc";

export type ReviewType = {
  restaurant: {
    subject: Restaurant;
    data: RestaurantReview;
    creatorData: RestaurantReviewCreator;
    fullData: RestaurantReviewFull;
  };
  dish: {
    subject: Dish;
    data: DishReview;
    creatorData: DishReviewCreator;
    fullData: DishReviewFull;
  };
};

type ReviewFunctions = {
  [Key in keyof ReviewType]: {
    getById: (
      id: ReviewType[Key]["data"]["id"]
    ) => Promise<ReviewType[Key]["fullData"] | null>;
    getBySubjectId: (
      id: ReviewType[Key]["subject"]["id"],
      take: number,
      skip?: number
    ) => Promise<ReviewType[Key]["fullData"][]>;
    getByAuthorId: (
      id: BaseReview["authorId"],
      take: number,
      skip?: number
    ) => Promise<ReviewType[Key]["fullData"][]>;
    getSubject: (
      id: ReviewType[Key]["subject"]["id"]
    ) => Promise<ReviewType[Key]["subject"] | null>;
    create: (
      data: ReviewType[Key]["creatorData"]
    ) => Promise<BaseReview | null>;
    edit: (
      data: ReviewType[Key]["data"]
    ) => Promise<ReviewType[Key]["data"] | null>;
  };
};

export const REVIEW_FUNCTIONS_FACTORY: ReviewFunctions = {
  restaurant: {
    getById: getRestaurantReviewById,
    getBySubjectId: getRestaurantReviewsByRestaurantId,
    getByAuthorId: getRestaurantReviewsByAuthorId,
    getSubject: async (id) => await transferWithJSON(getRestaurantById, [id]),
    create: createRestaurantReview,
    edit: updateRestaurantReview,
  },
  dish: {
    getById: getDishReviewById,
    getBySubjectId: getDishReviewsByDishId,
    getByAuthorId: getDishReviewsByAuthorId,
    getSubject: async (id) => await getDishById(id),
    create: createDishReview,
    edit: updateDishReview,
  },
};
