import { createSlice } from "@reduxjs/toolkit";

type ReviewsState = {
  update: number;
};

const INITIAL_STATE: ReviewsState = {
  update: 0,
};

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState: INITIAL_STATE,
  reducers: {
    updateReviewsUpdate(state) {
      state.update = state.update + 1;
    },
  },
});

export const { updateReviewsUpdate } = reviewsSlice.actions;

export const reviewsReducer = reviewsSlice.reducer;
