"use client";

import { ReviewType } from "@/utils/factories/reviews";
import { Dispatch, SetStateAction, useState } from "react";

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

type Store<Type extends keyof ReviewType> = {
  [Key in keyof ReviewType[Type]["creatorData"]]: [
    ReviewType[Type]["creatorData"][Key],
    Dispatch<SetStateAction<ReviewType[Type]["creatorData"][Key]>>
  ];
};

const useReviewStore = <Type extends keyof ReviewType>(type: Type) => {
  const dict = Object.entries(storeDefaults[type])
    .map(([key, value]) => {
      const keyHelper = key as keyof ReviewType[Type]["creatorData"];
      return {
        [key]:
          useState<ReviewType[Type]["creatorData"][typeof keyHelper]>(value),
      };
    })
    .reduce((acc, v) => ({ ...acc, ...v }), {}) as Store<Type>;

  const getKeys = (): (keyof ReviewType[Type]["creatorData"])[] => {
    return Object.keys(
      storeDefaults[type]
    ) as (keyof ReviewType[Type]["creatorData"])[];
  };

  const getState = <Key extends keyof ReviewType[Type]["creatorData"]>(
    key: Key
  ): ReviewType[Type]["creatorData"][Key] => {
    return dict[key][0];
  };

  const setState = <Key extends keyof ReviewType[Type]["creatorData"]>(
    key: Key,
    value: ReviewType[Type]["creatorData"][Key]
  ) => {
    dict[key][1](value);
  };

  const getCreator = (): ReviewType[Type]["creatorData"] => {
    return Object.entries(dict)
      .map((e) => ({ [e[0]]: e[1][0] }))
      .reduce(
        (acc, v) => ({ ...acc, ...v }),
        {}
      ) as ReviewType[Type]["creatorData"];
  };

  return { getKeys, getState, setState, getCreator };
};

export default useReviewStore;
