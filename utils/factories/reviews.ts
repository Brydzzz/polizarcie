import {
  createDishReview,
  createRestaurantReview,
  deleteDishReview,
  deleteRestaurantReview,
  DishReviewCreator,
  DishReviewFull,
  getDishReviewsByDishId,
  getRestaurantReviewsByRestaurantId,
  RestaurantReviewCreator,
  RestaurantReviewFull,
  updateDishReview,
  updateRestaurantReview,
} from "@/lib/db/reviews";
import {
  selectDishReviewCreator,
  selectRestaurantReviewCreator,
} from "@/lib/store/reviews/reviews.selector";
import {
  resetDishReviewCreator,
  resetRestaurantReviewCreator,
} from "@/lib/store/reviews/reviews.slice";
import { RootState } from "@/lib/store/store";
import { Dish, DishReview, Restaurant, RestaurantReview } from "@prisma/client";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { getDishById } from "../../lib/db/dishes";
import { getRestaurantById } from "../../lib/db/restaurants";

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
    getBySubjectId: (
      id: ReviewType[Key]["subject"]["id"],
      take: number,
      skip?: number
    ) => Promise<ReviewType[Key]["fullData"][]>;
    getSubject: (
      id: ReviewType[Key]["subject"]["id"]
    ) => Promise<ReviewType[Key]["subject"] | null>;
    create: (
      data: ReviewType[Key]["creatorData"]
    ) => Promise<ReviewType[Key]["data"] | null>;
    edit: (
      data: ReviewType[Key]["data"]
    ) => Promise<ReviewType[Key]["data"] | null>;
    delete: (
      id: ReviewType[Key]["data"]["id"]
    ) => Promise<ReviewType[Key]["data"] | null>;
    selectCreator: (state: RootState) => ReviewType[Key]["creatorData"];
    resetCreator: ActionCreatorWithoutPayload;
  };
};

export const REVIEW_FUNCTIONS_FACTORY: ReviewFunctions = {
  restaurant: {
    getBySubjectId: getRestaurantReviewsByRestaurantId,
    getSubject: async (id) => await getRestaurantById(id),
    create: createRestaurantReview,
    edit: updateRestaurantReview,
    delete: deleteRestaurantReview,
    selectCreator: selectRestaurantReviewCreator,
    resetCreator: resetRestaurantReviewCreator,
  },
  dish: {
    getBySubjectId: getDishReviewsByDishId,
    getSubject: async (id) => await getDishById(id),
    create: createDishReview,
    edit: updateDishReview,
    delete: deleteDishReview,
    selectCreator: selectDishReviewCreator,
    resetCreator: resetDishReviewCreator,
  },
};
