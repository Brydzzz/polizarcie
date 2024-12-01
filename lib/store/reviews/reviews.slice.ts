import { DishReviewCreator, RestaurantReviewCreator } from "@/lib/db/reviews";
import { ReviewType } from "@/utils/factories/reviews";
import { createSlice } from "@reduxjs/toolkit";
import { DispatchAction } from "../store";

type ReviewsState = {
  creators: {
    [Key in keyof ReviewType]: ReviewType[Key]["creatorData"];
  };
  update: number;
  freeCreatorForced: { [Key in keyof ReviewType]: number };
};

const INITIAL_STATE: ReviewsState = {
  creators: {
    restaurant: {
      subjectId: "",
      content: "",
      stars: 0,
      amountSpent: 0,
    },
    dish: {
      subjectId: "",
      content: "",
      stars: 0,
    },
  },
  update: 0,
  freeCreatorForced: {
    restaurant: 0,
    dish: 0,
  },
};

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState: INITIAL_STATE,
  reducers: {
    setRestaurantReviewCreator(
      state,
      action: DispatchAction<RestaurantReviewCreator>
    ) {
      state.creators.restaurant = action.payload;
    },
    resetRestaurantReviewCreator(state) {
      console.log("test");

      state.creators.restaurant = INITIAL_STATE["creators"]["restaurant"];
    },
    setDishReviewCreator(state, action: DispatchAction<DishReviewCreator>) {
      state.creators.dish = action.payload;
    },
    resetDishReviewCreator(state) {
      state.creators.dish = INITIAL_STATE["creators"]["dish"];
    },
    updateReviewsUpdate(state) {
      state.update = state.update + 1;
    },
    forceCreatorFree(state, action: DispatchAction<keyof ReviewType>) {
      state.freeCreatorForced[action.payload] =
        state.freeCreatorForced[action.payload] + 1;
    },
  },
});

export const {
  setRestaurantReviewCreator,
  setDishReviewCreator,
  resetRestaurantReviewCreator,
  resetDishReviewCreator,
  updateReviewsUpdate,
  forceCreatorFree,
} = reviewsSlice.actions;

export const reviewsReducer = reviewsSlice.reducer;
