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
import { DishReview, RestaurantReview } from "@prisma/client";

export type ReviewType = {
  restaurant: RestaurantReview;
  dish: DishReview;
};

type ReviewFunctions = {
  [Key in keyof ReviewType]: {
    getByTypeId: (id: string) => Promise<ReviewType[Key][] | null>;
    create: (data: ReviewType[Key]) => Promise<ReviewType[Key] | null>;
    edit: (data: ReviewType[Key]) => Promise<ReviewType[Key] | null>;
    delete: (id: string) => Promise<ReviewType[Key] | null>;
  };
};

export const REVIEW_FUNCTIONS = {
  restaurant: {
    getByTypeId: getRestaurantReviewsByRestaurantId,
    create: createRestaurantReview,
    edit: updateRestaurantReview,
    delete: deleteRestaurantReview,
  },
  dish: {
    getByTypeId: getDishReviewsByDishId,
    create: createDishReview,
    edit: updateDishReview,
    delete: deleteDishReview,
  },
} as const satisfies ReviewFunctions;
