import {
  BaseReviewFull,
  getBaseReviewById,
} from "@/lib/db/reviews/base-reviews";
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
  createResponseReview,
  getResponseReviewById,
  getResponseReviewsByAuthorId,
  getResponseReviewsByReviewId,
  ResponseReviewCreator,
  ResponseReviewFull,
  updateResponseReview,
} from "@/lib/db/reviews/response-reviews";
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
  ResponseReview,
  Restaurant,
  RestaurantReview,
} from "@prisma/client";
import { getDishById } from "../../lib/db/dishes";
import { getRestaurantById } from "../../lib/db/restaurants";
import { PoliError } from "../misc";

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
  response: {
    subject: BaseReviewFull["baseData"];
    data: ResponseReview;
    creatorData: ResponseReviewCreator;
    fullData: ResponseReviewFull;
  };
};

type ReviewFunctions = {
  [Key in keyof ReviewType]: {
    getById: (
      id: ReviewType[Key]["data"]["id"]
    ) => Promise<ReviewType[Key]["fullData"] | null | PoliError>;
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
    ) => Promise<ReviewType[Key]["subject"] | null | PoliError>;
    create: (
      data: ReviewType[Key]["creatorData"]
    ) => Promise<BaseReview | null | PoliError>;
    edit: (
      data: ReviewType[Key]["data"]
    ) => Promise<ReviewType[Key]["data"] | null | PoliError>;
  };
};

export const REVIEW_FUNCTIONS_FACTORY: ReviewFunctions = {
  restaurant: {
    getById: getRestaurantReviewById,
    getBySubjectId: getRestaurantReviewsByRestaurantId,
    getByAuthorId: getRestaurantReviewsByAuthorId,
    getSubject: getRestaurantById,
    create: createRestaurantReview,
    edit: updateRestaurantReview,
  },
  dish: {
    getById: getDishReviewById,
    getBySubjectId: getDishReviewsByDishId,
    getByAuthorId: getDishReviewsByAuthorId,
    getSubject: getDishById,
    create: createDishReview,
    edit: updateDishReview,
  },
  response: {
    getById: getResponseReviewById,
    getBySubjectId: getResponseReviewsByReviewId,
    getByAuthorId: getResponseReviewsByAuthorId,
    getSubject: getBaseReviewById,
    create: createResponseReview,
    edit: updateResponseReview,
  },
};
