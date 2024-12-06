import {
  createDishReview,
  deleteDishReview,
  DishReviewCreator,
  DishReviewFull,
  getDishReviewById,
  getDishReviewsByAuthorId,
  getDishReviewsByDishId,
  hideDishReview,
  updateDishReview,
} from "@/lib/db/reviews/dish-reviews";
import {
  createRestaurantReview,
  deleteRestaurantReview,
  getRestaurantReviewById,
  getRestaurantReviewsByAuthorId,
  getRestaurantReviewsByRestaurantId,
  hideRestaurantReview,
  RestaurantReviewCreator,
  RestaurantReviewFull,
  updateRestaurantReview,
} from "@/lib/db/reviews/restaurant-reviews";
import { Dish, DishReview, Restaurant, RestaurantReview } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { getDishById } from "../../lib/db/dishes";
import { getRestaurantById } from "../../lib/db/restaurants";

// type GenericReview = {
//   id: string;
//   authorId: string;
//   subjectId: string;
//   content: string;
//   createdAt: Date;
//   updatedAt: Date;
// };

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
      id: ReviewType[Key]["data"]["authorId"],
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
    hide: (
      id: ReviewType[Key]["data"]["id"],
      hide: boolean
    ) => Promise<ReviewType[Key]["data"] | null>;
  };
};

export const REVIEW_FUNCTIONS_FACTORY: ReviewFunctions = {
  restaurant: {
    getById: getRestaurantReviewById,
    getBySubjectId: getRestaurantReviewsByRestaurantId,
    getByAuthorId: getRestaurantReviewsByAuthorId,
    getSubject: async (id) => await getRestaurantById(id),
    create: createRestaurantReview,
    edit: updateRestaurantReview,
    delete: deleteRestaurantReview,
    hide: hideRestaurantReview,
  },
  dish: {
    getById: getDishReviewById,
    getBySubjectId: getDishReviewsByDishId,
    getByAuthorId: getDishReviewsByAuthorId,
    getSubject: async (id) => await getDishById(id),
    create: createDishReview,
    edit: updateDishReview,
    delete: deleteDishReview,
    hide: hideDishReview,
  },
};

const storeDefaults: {
  [Type in keyof ReviewType]: {
    [Key in keyof ReviewType[Type]["creatorData"]]: ReviewType[Type]["creatorData"][Key];
  };
} = {
  restaurant: {
    subjectId: "",
    stars: 0,
    amountSpent: 0,
    content: "",
  },
  dish: {
    subjectId: "",
    stars: 0,
    content: "",
  },
};

export class ReviewStore<Type extends keyof ReviewType> {
  private type: Type;
  private dict: {
    [Key in keyof ReviewType[Type]["creatorData"]]: [
      ReviewType[Type]["creatorData"][Key],
      Dispatch<SetStateAction<ReviewType[Type]["creatorData"][Key]>>
    ];
  };

  constructor(type: Type) {
    this.type = type;
    this.dict = Object.entries(storeDefaults[this.type])
      .map(([key, value]) => {
        const keyHelper = key as keyof ReviewType[Type]["creatorData"];
        return {
          [key]:
            useState<ReviewType[Type]["creatorData"][typeof keyHelper]>(value),
        };
      })
      .reduce((acc, v) => ({ ...acc, ...v }), {}) as typeof this.dict;
  }

  getKeys(): (keyof ReviewType[Type]["creatorData"])[] {
    return Object.keys(
      storeDefaults[this.type]
    ) as (keyof ReviewType[Type]["creatorData"])[];
  }

  getState<Key extends keyof ReviewType[Type]["creatorData"]>(
    key: Key
  ): ReviewType[Type]["creatorData"][Key] {
    return this.dict[key][0];
  }

  setState<Key extends keyof ReviewType[Type]["creatorData"]>(
    key: Key,
    value: ReviewType[Type]["creatorData"][Key]
  ) {
    this.dict[key][1](value);
  }

  getCreator(): ReviewType[Type]["creatorData"] {
    return Object.entries(this.dict)
      .map((e) => ({ [e[0]]: e[1][0] }))
      .reduce(
        (acc, v) => ({ ...acc, ...v }),
        {}
      ) as ReviewType[Type]["creatorData"];
  }
}
