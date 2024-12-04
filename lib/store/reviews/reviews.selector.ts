import { createSelector } from "reselect";
import { RootState } from "../store";

const selectReviewsReducer = (state: RootState) => state.reviews;

export const selectReviewsUpdate = createSelector(
  [selectReviewsReducer],
  (reviewReducer) => reviewReducer.update
);
